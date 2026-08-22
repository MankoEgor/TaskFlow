import { useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useColumn } from "../../hooks/useColumn";
import { useBoardTask } from "../../hooks/useBoardTask";
import { useTask } from "../../hooks/useTask";
import { useBoardRealtime } from "../../hooks/useBoardRealtime";


import CreateModalWindow from "../../components/shared/CreateModalWindow/CreateModalWindow";
import ErrorModalWindow from "../../components/shared/ErrorModalWindow/ErrorModalWindow";
import Loader from "../../components/shared/Loader/Loader";
import InviteModalWindow from "../../components/shared/InviteModalWindow/InviteModalWindow";

import BoardHeader from "../../components/board/BoardHeader/BoardHeader";
import KanbanBoard from "../../components/board/KanbanBoard/KanbanBoard";


import { useAuth } from "../../hooks/useAuth";
import { useBoardTitle } from "../../hooks/useBoardTitle";
import { useBoardMembers } from "../../hooks/useBoardMembers";
import { toError } from "../../utils/errors";
import { useKanbanDnd } from "../../hooks/useKanbanDnd";

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

    const isOwner = members.some(
        (member) => member.id === user?.id && member.role === 'owner');

    const membersById = useMemo(
        () => 
            new Map(members.map(member => [member.id, member] as const)), 
        [members]
    );

    const {boardTitle, titleError} = useBoardTitle(id);


    const [title, setTitle] = useState<string>('');
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [isInviteClicked, setIsInviteClicked] = useState<boolean>(false);

    const {tasks, error, isLoading} = useBoardTask(id);
    const {moveTask} = useTask(id);
    

    const {
        columns,
        createColumn,
        isCreating,
        deleteColumn,
        updateColumnTitle,
        isUpdated,
        error: columnsError
    } = useColumn(id);


    const showOperationError = useCallback((operationError: Error) => {
        toast.error(operationError.message);
    }, []);

    const {
        items,
        handleDragOver,
        handleDragEnd,
    } = useKanbanDnd({
        columns,
        tasks,
        moveTask,
        onError: showOperationError,
    });


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
            showOperationError(toError(err, 'Failed to create column'));
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
            showOperationError(toError(err, 'Failed to remove member'));
        }
    }

    const handleDeleteColumn = async (columnId: string) => {

        try {
            await deleteColumn(columnId);
        } catch (err: unknown) {
            showOperationError(toError(err, 'Failed to delete column'));
        }
    }

    const handleUpdateColumnTitle = async (input: {columnId: string, title: string}) => {
        await updateColumnTitle(input);
    }

    if(isLoading)
        return <Loader/>

    const pageError = error ?? columnsError ?? titleError ?? membersError;

    if(pageError)
        return <ErrorModalWindow error={pageError}/>;

   return (
        <>

            <BoardHeader
                boardTitle={boardTitle}
                members={members}
                isMembersLoading={isMembersLoading}
                isOwner={isOwner}
                isRemoving={isRemoving}
                setIsInviteClicked={setIsInviteClicked}
                handleRemoveMember={handleRemoveMember}
            />

            <KanbanBoard
                members={members}
                membersById={membersById}
                items={items}
                columns={columns}
                isOwner={isOwner}
                isUpdated={isUpdated}
                handleDeleteColumn={handleDeleteColumn}
                handleUpdateColumnTitle={handleUpdateColumnTitle}
                onColumnAdd={() => setIsClicked(true)}
                handleDragEnd={handleDragEnd}
                handleDragOver={handleDragOver}
            />

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

        </>
    );
}

export default BoardPage;
