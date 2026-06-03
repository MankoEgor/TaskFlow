import s from './CreateBoarderModalWindow.module.css'
import cross from '../../../assets/cross.svg';
import create from '../../../assets/createButton.svg'

interface CreateBoardModalWindowProps {
    title: string;
    setTitle: (title: string) => void;
    setIsClicked: (isClicked: boolean) => void;
    isCreating: boolean;
    heandleCreateBoards: (e: React.FormEvent<HTMLFormElement>) => void;

}


function CreateBoardModalWindow({ title, setTitle, setIsClicked, isCreating, heandleCreateBoards}: CreateBoardModalWindowProps) {

   const heandleClose = () =>{
        setTitle('');
        setIsClicked(false);
   } 

    return (
        <div className={s.overlay}>
            <div className={s.backdrop}>
                <div className={s.content}>

                    <div className={s.modal}>

                        <div className={s.header}>
                            <div className={s.headerText}>
                                <h1 className={s.headerTitle}>Create New Board</h1>
                                <p className={s.headerDiscription}>Set up a new space for your team's workflow.</p>
                            </div>
                            <div className={s.closeButton} onClick={heandleClose}>
                                <img src={cross} alt="Close" />
                            </div>
                        </div>

                        <form className={s.form} onSubmit={heandleCreateBoards}>

                            <div className={s.inputDiv}>
                                <label className={s.modalLabel} htmlFor="boardName">BOARD NAME</label>
                                <input
                                    className={s.modalInput}
                                    id='boardName'
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter board title"
                                />
                            </div>

                            
                            <div className={s.buttonDiv}>
                                <button 
                                    className={s.createButton}
                                    type="submit"  
                                    disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create Board'}
                                    <img src={create} alt="" />
                                </button>
                                <button 
                                    className={s.cancelButton}
                                    type='submit' 
                                    disabled={isCreating}>
                                    Cancel
                                </button>
                            </div>
                            

                        </form>
                    </div>
                </div>
                
            </div>  

        </div>
        
    )
}

export default CreateBoardModalWindow;