import s from './CreateModalWindow.module.css'
import cross from '../../../assets/cross.svg';
import create from '../../../assets/createButton.svg'

interface CreateModalWindowProps {
    headerTitle: string,
    headerDiscription?: string,
    labelText: string,
    title: string;
    setTitle: (title: string) => void;
    setIsClicked: (isClicked: boolean) => void;
    isCreating: boolean;
    heandleCreate: (e: React.FormEvent<HTMLFormElement>) => void;

}


function CreateModalWindow({headerTitle, headerDiscription, labelText, title, setTitle, setIsClicked, isCreating, heandleCreate}: CreateModalWindowProps) {

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
                                <h1 className={s.headerTitle}>{headerTitle}</h1>
                                {headerDiscription && <p className={s.headerDiscription}>{headerDiscription}</p>}
                            </div>
                            <div className={s.closeButton} onClick={heandleClose}>
                                <img src={cross} alt="Close" />
                            </div>
                        </div>

                        <form className={s.form} onSubmit={heandleCreate}>

                            <div className={s.inputDiv}>
                                <label className={s.modalLabel} htmlFor="name">{labelText}</label>
                                <input
                                    className={s.modalInput}
                                    id='name'
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title"
                                />
                            </div>

                            
                            <div className={s.buttonDiv}>
                                <button 
                                    className={s.createButton}
                                    type="submit"  
                                    disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create'}
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

export default CreateModalWindow;