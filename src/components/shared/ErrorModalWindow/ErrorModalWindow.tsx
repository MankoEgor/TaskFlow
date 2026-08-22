import { useId } from 'react';

import s from './ErrorModalWindow.module.css'
import { useDialogAccessibility } from '../../../hooks/useDialogAccessibility';

type ErrorModalWindowProps = {
  error: Error | string;
  onClose?: () => void;
};

function ErrorModalWindow({ error, onClose }: ErrorModalWindowProps){
    const titleId = useId();
    const messageId = useId();
    const dialogRef = useDialogAccessibility<HTMLDivElement>(onClose);

    return(
        <div className={s.overlay}>
            <div
                ref={dialogRef}
                className={s.modal}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={messageId}
                tabIndex={-1}>
                <h3 id={titleId} className={s.errorTitle}>{typeof error === 'string' ? 'Error' : error.name || 'Error'}</h3>
                <p id={messageId} className={s.errorMessage}>{typeof error === 'string' ? error : error.message}</p>
                {onClose && (
                    <button className={s.button} type="button" onClick={onClose}>
                        OK
                    </button>
                )}
            </div>
        </div>
    )
} 

export default ErrorModalWindow;
