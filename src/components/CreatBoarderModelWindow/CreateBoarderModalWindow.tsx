import s from './CreateBoarderModalWindow.module.css'

interface CreateBoardModalWindowProps {
    title: string;
    setTitle: (title: string) => void;
    isCreating: boolean;
    heandleCreateBoards: (e: React.FormEvent) => void;

}


function CreateBoardModalWindow({ title, setTitle, isCreating, heandleCreateBoards }: CreateBoardModalWindowProps) {
    return (
        <div className={s.modal}>
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
        </div>
        
    )
}

export default CreateBoardModalWindow;