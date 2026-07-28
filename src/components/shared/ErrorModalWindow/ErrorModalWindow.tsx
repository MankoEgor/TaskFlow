import s from './ErrorModalWindow.module.css'

type ErrorModalWindowProps = {
  error: Error | string;
  onClose?: () => void;
};

function ErrorModalWindow({ error, onClose }: ErrorModalWindowProps){
    return(
        <div className={s.overlay}>
            <div className={s.modal}>
                <h3 className={s.errorTitle}>{typeof error === 'string' ? 'Error' : error.name || 'Error'}</h3>
                <p className={s.errorMessage}>{typeof error === 'string' ? error : error.message}</p>
                {onClose && (
                    <button className={s.button} onClick={onClose}>
                        OK
                    </button>
                )}
            </div>
        </div>
    )
} 

export default ErrorModalWindow;