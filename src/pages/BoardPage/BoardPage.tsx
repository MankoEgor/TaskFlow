import s from './BoardPage.module.css'
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { useBoards } from '../../hooks/useBoard.ts';


function BoardPage() {

    const { user, signOut } = useAuth();

    const {
        boards,
        isLoading,
        error,
        createBoard,
        isCreating,
        deleteBoard,
        isDeleting
    } = useBoards(user?.id)

    const [title, setTitle] = useState<string>('');


    const heandleCreateBoards = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!user) return;
        if(!title.trim()) return; 

        await createBoard({
            title: title.trim(),
            userId: user?.id
        })

        setTitle('');
    }


    const heandleDeleteBoard = async (board_Id: string) => {
        await deleteBoard(board_Id)
    }

    return (
        <>
            <main>
                <p>{user?.email}</p>
                <form onSubmit={heandleCreateBoards}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter board title"
                    />
                    <button type="submit" disabled={isCreating}>
                        {isCreating ? 'Creating...' : 'Create Board'}
                    </button>
                </form>

                {boards.map( (b: any) => (
                    <div key={b.id} className={s.card}>
                        <h1> {b.title} </h1>
                        <p> {b.createAt} </p>
                    </div>
                ))}
            </main>
        </>
    )
}

export default BoardPage;