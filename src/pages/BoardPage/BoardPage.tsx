import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useColumn } from "../../hooks/useColumn";
import { useBoardTask } from "../../hooks/useBoardTask";
import { useTask } from "../../hooks/useTask";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/dom";

import type { Task } from "../../types/tasks.type";

import ColumnBoard from "../../components/board/ColumnBoard/ColumnBoard";
import CreateModalWindow from "../../components/shared/CreateModalWindow/CreateModalWindow";
import ErrorModalWindow from "../../components/shared/ErrorModalWindow/ErrorModalWindow";
import Loader from "../../components/shared/Loader/Loader";
import InviteModalWindow from "../../components/shared/InviteModalWindow/InviteModalWindow";
import Button from "../../components/shared/Button/Button";
import ProfileIcon from "../../components/shared/ProfileIcon/ProfileIcon";

import addColumnIcon from '../../assets/addColumn.svg'
import backIcon from '../../assets/arrow_back.svg'
import addIcon from '../../assets/add.svg'


import s from './BoardPage.module.css'
import { useAuth } from "../../hooks/useAuth";
import { useBoardTitle } from "../../hooks/useBoardTitle";
import { useBoardMembers } from "../../hooks/useBoardMembers";
import { toError } from "../../utils/errors";

function BoardPage(){

    const {id} = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const {members} = useBoardMembers(id);

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

    if(isLoading)
        return <Loader/>

    const pageError = error ?? columnsError ?? titleError;

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

            <div className={s.boardScroll}>

                <div className={s.header}>
                    <div className={s.navigation}>
                        <Button 
                            message="Back"
                            icon={backIcon}
                            onClick={() => navigate('/board')}
                            />
                        <h1>{boardTitle}</h1>
                    </div>

                    <div className={s.memberDiv}>
                        {members.map((member) => (
                            <ProfileIcon 
                                key={member.id}
                                name={member.name}
                                avatarUrl={member.avatar_url}
                            />
                        ))}
                        <button className={s.addMember} onClick={() => setIsInviteClicked(true)}>
                            <img className={s.addMemberIcon} src={addIcon} alt="Invite Member" />
                            <p className={s.addMemberText}>Invite</p>
                        </button>
                    </div>

                </div>

                <div className={s.columnDiv}>
                    {columns.map((column) => (
                    <ColumnBoard 
                        key={column.id}
                        column={column}
                        tasks={items[column.id] ?? []}
                        isUpdated={isUpdated}
                        deleteColumn={async (columnId) => {
                            try {
                                await deleteColumn(columnId);
                            } catch (err: unknown) {
                                setLocalError(toError(err, 'Failed to delete column'));
                            }
                        }}
                        updateColumn={async (input) => {
                            try {
                                await updateColumnTitle(input);
                            } catch (err: unknown) {
                                setLocalError(toError(err, 'Failed to update column'));
                            }
                        }}
                        />
                    ))}

                    <div onClick={() => setIsClicked(true)} className={s.addButton}>
                        <img className={s.addButtonIcon} src={addColumnIcon} alt="" />
                        <p className={s.addButtonText}>Add Column</p>
                    </div>
                </div>

                {isClicked && <CreateModalWindow
                                    headerTitle="Create New Column"
                                    labelText="COLUMN TITLE"
                                    isDoneState={isCreating}
                                    setIsClicked={setIsClicked}
                                    setTitle={setTitle}
                                    title={title}
                                    heandleCreate={handleCreateColumn}/>}

                {isInviteClicked && <InviteModalWindow 
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
