import { useId } from 'react';

import s from './CreateModalWindow.module.css'
import cross from '../../../assets/cross.svg';
import create from '../../../assets/createButton.svg'
import { useDialogAccessibility } from '../../../hooks/useDialogAccessibility';

interface CreateModalWindowProps {
    headerTitle: string,
    headerDiscription?: string,
    labelText: string,
    title: string;
    setTitle: (title: string) => void;
    setIsClicked: (isClicked: boolean) => void;
    isDoneState?: boolean;
    heandleCreate: (e: React.FormEvent<HTMLFormElement>) => void;
    prevTitle?: string

}


function CreateModalWindow({
    headerTitle, 
    headerDiscription, 
    labelText, 
    title, 
    setTitle, 
    setIsClicked, 
    isDoneState, 
    heandleCreate,
    prevTitle
}: CreateModalWindowProps) {

   const heandleClose = () =>{
        setTitle('');
        setIsClicked(false);
   }

    const titleId = useId();
    const descriptionId = useId();
    const dialogRef = useDialogAccessibility<HTMLDivElement>(heandleClose);

    return (
        <div className={s.overlay}>
            <div className={s.backdrop}>
                <div className={s.content}>

                    <div
                        ref={dialogRef}
                        className={s.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={headerDiscription ? descriptionId : undefined}
                        tabIndex={-1}>

                        <div className={s.header}>
                            <div className={s.headerText}>
                                <h1 id={titleId} className={s.headerTitle}>{headerTitle}</h1>
                                {headerDiscription && <p id={descriptionId} className={s.headerDiscription}>{headerDiscription}</p>}
                            </div>
                            <button
                                className={s.closeButton}
                                type="button"
                                title="Close"
                                aria-label="Close dialog"
                                onClick={heandleClose}>
                                <img src={cross} alt="" />
                            </button>
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
                                    placeholder={prevTitle ? prevTitle : 'Enter title'}
                                />
                            </div>

                            
                            <div className={s.buttonDiv}>
                                <button 
                                    className={s.createButton}
                                    type="submit"  
                                    disabled={isDoneState}>
                                    {isDoneState ? 'Doing' : 'Do'}
                                    <img src={create} alt="" />
                                </button>
                                <button 
                                    className={s.cancelButton}
                                    type='button'
                                    disabled={isDoneState}
                                    onClick={heandleClose}>
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
