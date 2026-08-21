import { useId, useState } from 'react';
import { createBoardInvite} from '../../../services/boardInvites.service'
import ModalInput from '../ModalInput/ModalInput';
import { useDialogAccessibility } from '../../../hooks/useDialogAccessibility';


import s from './InviteModalWindow.module.css'

import crossIcon from '../../../assets/cross.svg'

interface InviteModalWindowProps {
    boardId: string;
    userId?: string;
    boardTitle: string;
    setClose: (value: boolean) => void;
}

function InviteModalWindow({boardId, userId, boardTitle, setClose} : InviteModalWindowProps){

    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

    const handleClose = () => setClose(false);
    const titleId = useId();
    const dialogRef = useDialogAccessibility<HTMLDivElement>(handleClose);

    const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setSuccessMessage('');

        try{
            setIsSubmiting(true);
            
            await createBoardInvite(boardId, email, userId!);

            setEmail('');
            setSuccessMessage('Invite created. User will get access after registration.')

            setClose(false);



        } catch (error) {
            if(error instanceof Error){
                setError(error.message);
                return;
            }

            setError('Failed to create invite')
        }  finally {
            setIsSubmiting(false)
        }   
    }


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
                        tabIndex={-1}>
                        <div className={s.header}>
                            <div className={s.headerText}>
                                <h1 id={titleId} className={s.headerTitle}>Add new member in {boardTitle} board</h1>
                            </div>
                            <button
                                className={s.closeButton}
                                type="button"
                                title="Close"
                                aria-label="Close invite dialog"
                                onClick={handleClose}>
                                <img src={crossIcon} alt="" />
                            </button>
                        </div>

                        <form className={s.form} onSubmit={handleInvite}>
                            <ModalInput 
                                label='Email'
                                state={email}
                                placeholderText='test@gmail.com'
                                setStateFunc={setEmail}
                                />

                            {successMessage && <p className={s.successMessage}>{successMessage}</p>} 
                            {error && <p className={s.error}>{error}</p>}  

                            <div className={s.buttonDiv}>
                                <button 
                                    className={s.createButton}
                                    type='submit' 
                                    disabled={isSubmiting}>
                                    {isSubmiting ? 'Sending...' : 'Send Invite'}
                                </button>
                                <button 
                                    onClick={handleClose}
                                    className={s.cancelButton}
                                    disabled={isSubmiting}
                                    type='button'>
                                    <p>Cancel</p>
                                </button>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InviteModalWindow
