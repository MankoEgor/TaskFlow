import { useId, useState } from 'react';
import { toast } from 'sonner';
import { createBoardInvite} from '../../../services/boardInvites.service'
import ModalInput from '../ModalInput/ModalInput';
import { useDialogAccessibility } from '../../../hooks/useDialogAccessibility';
import { toError } from '../../../utils/errors';


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
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

    const handleClose = () => setClose(false);
    const titleId = useId();
    const dialogRef = useDialogAccessibility<HTMLDivElement>(handleClose);

    const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try{
            setIsSubmiting(true);
            
            await createBoardInvite(boardId, email, userId!);

            setEmail('');
            toast.success('Invite sent successfully');
            setClose(false);
        } catch (error: unknown) {
            toast.error(toError(error, 'Failed to create invite').message);
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
