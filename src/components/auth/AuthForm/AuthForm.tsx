import s  from './AuthForm.module.css';

interface AuthFormProps {
    headerText?: string;
    email: string;
    emailError: string
    setEmailError: (value: string) => void;
    password: string;
    passwordError: string;
    setPasswordError: (value: string) => void;
    buttonText: string;
    isSubmitting: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function AuthForm({ 
    headerText, 
    email, 
    emailError,
    setEmailError,
    password,
    passwordError,
    setPasswordError,
    buttonText, 
    onEmailChange,
    onPasswordChange,
    isSubmitting,
    onSubmit
}: AuthFormProps){

    const handleEmail = (emailInput: string) => {
        if(!emailInput.trim()){
            setEmailError("Email can't be empty")
        }

        setEmailError('');
        onEmailChange(emailInput);
    }

    const handlePassswor = (passwordInput: string) => {
        const passwordInputTrim = passwordInput.trim()

        if(!passwordInputTrim){
            setPasswordError("Password can't be empty")
        }

        if(passwordInputTrim.length < 8){
            setPasswordError("Password length less than 8 symbols");
        }

        setPasswordError('');
        onPasswordChange(passwordInputTrim);
    }

    return (
        
        <form className={s.form} onSubmit={onSubmit}>
            <h1 className={s.title}>{headerText}</h1>

            <label className={s.label} htmlFor="email">Email Address</label>
            <input className={s.input}
                type="email" 
                id="email" 
                value={email}
                placeholder="example@domain.com"  
                onChange={(e) => handleEmail(e.target.value)}/>
            {emailError && <p>{emailError}</p>}
            
            <label className={s.label} htmlFor="password">Password</label>
            <input className={s.input}
                type="password" 
                id="password" 
                value={password}
                placeholder="Minimum 8 characters" 
                onChange={(e) => handlePassswor(e.target.value)}/>
            {passwordError && <p>{passwordError}</p>}


            <button className={s.subButton} type="submit" disabled={isSubmitting}>
                {buttonText}
            </button>
        </form>
    )
}

export default AuthForm;