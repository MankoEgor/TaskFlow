import { useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useColumn } from "../../hooks/useColumn";
import { useBoardTask } from "../../hooks/useBoardTask";
import { useTask } from "../../hooks/useTask";
import { useBoardRealtime } from "../../hooks/useBoardRealtime";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/dom";

import type { Task } from "../../types/tasks.type";

import ColumnBoard from "../../components/board/ColumnBoard/ColumnBoard";
import CreateModalWindow from "../../components/shared/CreateModalWindow/CreateModalWindow";
import ErrorModalWindow from "../../components/shared/ErrorModalWindow/ErrorModalWindow";
import Loader from "../../components/shared/Loader/Loader";
import InviteModalWindow from "../../components/shared/InviteModalWindow/InviteModalWindow";

import BoardHeader from "../../components/board/BoardHeader/BoardHeader";

import addColumnIcon from '../../assets/addColumn.svg'


import s from './BoardPage.module.css'
import { useAuth } from "../../hooks/useAuth";
import { useBoardTitle } from "../../hooks/useBoardTitle";
import { useBoardMembers } from "../../hooks/useBoardMembers";
import { toError } from "../../utils/errors";

function BoardPage(){

    const {id} = useParams();
    useBoardRealtime(id);

    const { user } = useAuth();
    const {
        members,
        error: membersError,
        isLoading: isMembersLoading,
        removeMember,
        isRemoving
    } = useBoardMembers(id);

    const membersById = useMemo(
        () => 
            new Map(members.map(member => [member.id, member] as const)), 
        [members]
    );

    const currentMember = members.find((member) => member.id === user?.id);
    const isOwner = currentMember?.role === 'owner';

    const {boardTitle, titleError} = useBoardTitle(id);

    const [items, setItems] = useState<Record<string, Task[]>>({});
    const prevItems = useRef<Record<string, Task[]>>({});

    const [title, setTitle] = useState<string>('');
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [localError, setLocalError] = useState<Error | null>(null);
    

    const [isInviteClicked, setIsInviteClicked] = useState<boolean>(false);

    const {tasks, error, isLoading} = useBoardTask(id);
    const {moveTask, reorderTasks} = useTask(id);
    

    const {
        columns,
        createColumn,
        isCreating,
        deleteColumn,
        updateColumnTitle,
        isUpdated,
        error: columnsError
    } = useColumn(id);

    

    useEffect(() => {
        const groupedTasks: Record<string, Task[]> = {};

        columns.forEach((column) => {
            groupedTasks[column.id] = [];
        });

        tasks.forEach((task) => {
            if (!groupedTasks[task.column_id]) {
            groupedTasks[task.column_id] = [];
            }

            groupedTasks[task.column_id].push(task);
        });

        for (const columnId in groupedTasks) {
            groupedTasks[columnId].sort((a, b) => a.position - b.position);
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(groupedTasks);
    }, [tasks, columns]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { source, target } = event.operation;

        if (!source || !target) return;
        if (source.type !== 'task') return;

        const taskId = source.data?.taskId as string | undefined;
        const sourceColumnId = source.data?.columnId as string | undefined;
        const targetColumnId = target.data?.columnId as string | undefined;

        if (!taskId || !sourceColumnId || !targetColumnId) return;

        const finalColumnTasks = items[targetColumnId] ?? [];

        let targetPosition = finalColumnTasks.findIndex(
            (task) => task.id === taskId
        );

        if (targetPosition === -1) {
            targetPosition = finalColumnTasks.length;
        }

        try {
            if (sourceColumnId !== targetColumnId) {
                await moveTask({
                taskId,
                targetColumnId,
                targetPosition,
                });

                return;
            }

            await reorderTasks(
                finalColumnTasks.map((task, index) => ({
                id: task.id,
                position: index,
                }))
            );
        } catch (err: unknown) {
            setLocalError(toError(err, 'Failed to move task'));
        }
    };

    const handleCreateColumn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(!title.trim()) return;

        try {
            await createColumn({
                boardId: id,
                title: title
            });

            setTitle('');
            setIsClicked(false);
        } catch (err: unknown) {
            setLocalError(toError(err, 'Failed to create column'));
        }
    }

    const handleRemoveMember = async (memberId: string, memberName: string | null) => {
        const confirmed = window.confirm(
            `Remove ${memberName ?? 'this member'} from the board?`
        );

        if (!confirmed) return;

        try {
            await removeMember(memberId);
        } catch (err: unknown) {
            setLocalError(toError(err, 'Failed to remove member'));
        }
    }

    const handleDeleteColumn = async (columnId: string) => {

        try {
            await deleteColumn(columnId);
        } catch (err: unknown) {
            setLocalError(toError(err, 'Failed to delete column'));
        }
    }

    const handleUpdateColumnTitle = async (input: {columnId: string, title: string}) => {
        try {
            await updateColumnTitle(input);
        } catch (err: unknown) {
            setLocalError(toError(err, 'Failed to update column'));
        }
    }

    if(isLoading)
        return <Loader/>

    const pageError = error ?? columnsError ?? titleError ?? membersError;

    if(pageError)
        return <ErrorModalWindow error={pageError}/>;

   return (
        <DragDropProvider
            onDragStart={() => {
                prevItems.current = items;
            }}

            onDragOver={(event: DragOverEvent) => {
                const {source} = event.operation;

                if(source?.type !== 'task') return;

                setItems((currentItems) => move(currentItems, event))
            }}

            onDragEnd={async (event) => {
                if(event.canceled){
                    setItems(prevItems.current);
                    return;
                }

                await handleDragEnd(event)
            }}>

            <BoardHeader
                boardTitle={boardTitle}
                members={members}
                isMembersLoading={isMembersLoading}
                isOwner={isOwner}
                isRemoving={isRemoving}
                setIsInviteClicked={setIsInviteClicked}
                handleRemoveMember={handleRemoveMember}
            />
                
            <div className={s.boardScroll}>
                <div className={s.columnDiv}>
                    {columns.map((column) => (
                    <ColumnBoard 
                        key={column.id}
                        members={members}
                        membersById={membersById}
                        column={column}
                        tasks={items[column.id] ?? []}
                        canManageBoard={isOwner}
                        isUpdated={isUpdated}
                        deleteColumn={handleDeleteColumn}
                        updateColumn={handleUpdateColumnTitle}
                        />
                    ))}

                    {isOwner && <div onClick={() => setIsClicked(true)} className={s.addButton}>
                        <img className={s.addButtonIcon} src={addColumnIcon} alt="" />
                        <p className={s.addButtonText}>Add Column</p>
                    </div>}
                </div>

                {isClicked && <CreateModalWindow
                                    headerTitle="Create New Column"
                                    labelText="COLUMN TITLE"
                                    isDoneState={isCreating}
                                    setIsClicked={setIsClicked}
                                    setTitle={setTitle}
                                    title={title}
                                    heandleCreate={handleCreateColumn}/>}

                {isOwner && isInviteClicked && <InviteModalWindow
                                            boardTitle={boardTitle}
                                            userId={user?.id}
                                            boardId={id!}
                                            setClose={setIsInviteClicked}
                                            />}
            </div>

            {localError && <ErrorModalWindow error={localError} onClose={() => setLocalError(null)} />}

        </DragDropProvider>
    );
}

export default BoardPage;
