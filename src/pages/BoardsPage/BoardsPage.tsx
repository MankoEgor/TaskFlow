import s from './BoardsPage.module.css'
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { useBoards } from '../../hooks/useBoard.ts';

import type { Board } from '../../types/boards.type.ts';

import BoardCard from '../../components/board/BoardCard/BoardCard.tsx';
import addButton from '../../assets/add.svg';
import CreateModalWindow from '../../components/shared/CreateModalWindow/CreateModalWindow.tsx';
import ErrorModalWindow from '../../components/shared/ErrorModalWindow/ErrorModalWindow.tsx';
import Loader from '../../components/shared/Loader/Loader.tsx';


function BoardsPage() {

    const { user } = useAuth();

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
    const [localError, setLocalError] = useState<Error | null>(null);

    const heandleCreateBoards = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!user) return;
        if(!title.trim()) return; 


        try {
            await createBoard({
                title: title.trim(),
                userId: user?.id
            })
            setTitle('');
            setIsClicked(false);
        } catch (err: any) {
            setLocalError(err instanceof Error ? err : new Error(String(err)));
        }
    }

    const heandleDeleteBoard = async (board_Id: string) => {
        try {
            await deleteBoard(board_Id)
        } catch (err: any) {
            setLocalError(err instanceof Error ? err : new Error(String(err)));
        }
    }

    const getDuration = (createdAt: string) : string => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const duration = Math.floor((now.getTime() - createdDate.getTime()) / 1000); // Duration in seconds`
        if(duration < 60){
            return `${duration} seconds ago`;
        }
        else if(duration < 3600){
            const minutes = Math.floor(duration / 60);
            return `${minutes} minutes ago`;
        }
        else if(duration < 86400){
            const hours = Math.floor(duration / 3600);
            return `${hours} hours ago`;
        }

        return `${duration} seconds ago`;
    }

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
                        createAt={b.created_at}
                        createAtFunction={() => getDuration(b.created_at)}
                        deleteFunction={heandleDeleteBoard}
                    />
                    ))}
                </div>
            </main>
            {localError && <ErrorModalWindow error={localError} onClose={() => setLocalError(null)} />}
        </div>

            
    )
}

export default BoardsPage;