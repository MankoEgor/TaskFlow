import s  from './AuthForm.module.css';

interface AuthFormProps {
    headerText?: string;
    email: string;
    password: string;
    buttonText: string;
    errorMessage?: string;
    isSubmitting: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function AuthForm({ 
    headerText, 
    email, 
    password,
    buttonText, 
    errorMessage,
    onEmailChange,
    onPasswordChange,
    isSubmitting,
    onSubmit
}: AuthFormProps){

    return (
        
        <form className={s.form} onSubmit={onSubmit}>
            <h1 className={s.title}>{headerText}</h1>

            <label className={s.label} htmlFor="email">Email Address</label>
            <input className={s.input}
                type="email" 
                id="email" 
                value={email}
                placeholder="example@domain.com"  
                onChange={(e) => onEmailChange(e.target.value)}/>
            
            
            <label className={s.label} htmlFor="password">Password</label>
            <input className={s.input}
                type="password" 
                id="password" 
                value={password}
                placeholder="Minimum 8 characters" 
                onChange={(e) => onPasswordChange(e.target.value)}/>


            {errorMessage && <p>{errorMessage}</p>}

            <button className={s.subButton} type="submit" disabled={isSubmitting}>
                {buttonText}
            </button>
        </form>
    )
}

export default AuthForm;