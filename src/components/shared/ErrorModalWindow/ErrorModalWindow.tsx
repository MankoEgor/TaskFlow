import s from './ErrorModalWindow.module.css'

type ErrorModalWindowProps = {
  error: Error;
  onClose?: () => void;
};

function ErrorModalWindow({ error, onClose }: ErrorModalWindowProps){
    return(
        <div className={s.overlay}>
            <div className={s.modal}>
                <h3 className={s.errorTitle}>{error.name || 'Error'}</h3>
                <p className={s.errorMessage}>{error.message}</p>
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