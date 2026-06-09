import { useState } from "react";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ErrorModalWindow from "../../components/shared/ErrorModalWindow/ErrorModalWindow";

import s from './LoginPage.module.css'

function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [loginError, setLoginError] = useState<Error | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        setLoginError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsSubmitting(false);

        if (error) {
            setLoginError(new Error(error.message));
            return;
        }


        navigate("/boards");
    }

    return(
        <div className={s.main}>
            <AuthForm
            buttonText="Sign In"
            email={email}
            emailError={emailError}
            setEmailError={setEmailError}
            password={password}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            headerText="Welcome Back"
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
        />

        <Link className={s.regLink} to="/register">Create account</Link>

        {loginError && <ErrorModalWindow error={loginError} onClose={() => setLoginError(null)} />}
        </div>
        
    )
};

export default LoginPage;
