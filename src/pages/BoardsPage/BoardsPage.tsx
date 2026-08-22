import s from './BoardsPage.module.css'
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth.ts';
import { useBoards } from '../../hooks/useBoard.ts';
import { useAcceptPendingInvites } from '../../hooks/useAcceptPendingInvites.ts';

import type { Board } from '../../types/boards.type.ts';

import BoardCard from '../../components/board/BoardCard/BoardCard.tsx';
import addButton from '../../assets/add.svg';
import CreateModalWindow from '../../components/shared/CreateModalWindow/CreateModalWindow.tsx';
import ErrorModalWindow from '../../components/shared/ErrorModalWindow/ErrorModalWindow.tsx';
import Loader from '../../components/shared/Loader/Loader.tsx';
import { toError } from '../../utils/errors.ts';


function BoardsPage() {

    const { user } = useAuth();

    const { acceptedInvite } = useAcceptPendingInvites(user?.id)


    const {
        boards,
        isLoading,
        createBoard,
        isCreating,
        deleteBoard,
        error: boardsError,
    } = useBoards(user?.id)

    const [title, setTitle] = useState<string>('');
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const heandleCreateBoards = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!user) return;
        if(!title.trim()) return; 


        try {
            await createBoard({
                title: title.trim(),
            })
            setTitle('');
            setIsClicked(false);
        } catch (err: unknown) {
            toast.error(toError(err, 'Failed to create board').message);
        }
    }

    const heandleDeleteBoard = async (board_Id: string) => {
        try {
            await deleteBoard(board_Id)
        } catch (err: unknown) {
            toast.error(toError(err, 'Failed to delete board').message);
        }
    }

    useEffect(() => {

        if(!user?.id) return;

        acceptedInvite().catch((error: unknown) => {
            toast.error(toError(error, 'Failed to accept pending invites').message);
        });

    }, [user?.id, acceptedInvite])

    if (boardsError) {
        return <ErrorModalWindow error={boardsError} />;
    }

    if(isLoading){
        return <Loader/>
    }

    return (

        <div className={s.container}>
            <main>
   
                <div className={s.boardsContainer}>
                    <h1 className={s.boardsTitle}>My Projects</h1>
                    <p className={s.boardsDescription}>Manage and monitor your active boards across the organization.</p>
                </div>

                <div className={s.boardList}>

                    <div 
                        className={s.addButton}
                        onClick={() => setIsClicked(true)}>
                        <img src={addButton} alt="Add Board" />
                        <h1 className={s.addBoardTitle}>Create new board</h1>
                    </div>

                    {isClicked && <CreateModalWindow
                                        headerTitle='Create New Board'
                                        headerDiscription="Set up a new space for your team's workflow."
                                        labelText='BOARD NAME'
                                        title={title}
                                        setTitle={setTitle}
                                        setIsClicked={setIsClicked}
                                        isDoneState={isCreating}
                                        heandleCreate={heandleCreateBoards}/>}


                    {boards.map( (b: Board) => (
                    <BoardCard
                        key={b.id}
                        id={b.id}
                        title={b.title}
                        deleteFunction={heandleDeleteBoard}
                        canDelete={b.owner_id === user?.id}
                    />
                    ))}
                </div>
            </main>
        </div>

            
    )
}

export default BoardsPage;
