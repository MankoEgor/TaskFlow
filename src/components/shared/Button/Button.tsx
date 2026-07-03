import s from './Button.module.css'


interface ButtonProps {
    message: string,
    icon: string;
    onClick?: () => void;
}

function Button(button: ButtonProps){
    return(
        <button 
            onClick={button.onClick} 
            className={s.button}>
                <img className={s.buttonIcon} src={button.icon} alt={button.message} />
                <p className={s.buttonText}>{button.message}</p>

        </button>
    )
}

export default Button;