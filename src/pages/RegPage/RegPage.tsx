import { useState } from "react";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ErrorModalWindow from "../../components/shared/ErrorModalWindow/ErrorModalWindow";

import s from './RegPage.module.css'

function RegPage(){

        const [email, setEmail] = useState<string>("");
        const [password, setPassword] = useState<string>("");
        const [regError, setRegError] = useState<Error | null>(null);
        const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

        const navigate = useNavigate();

        const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            setIsSubmitting(true);
            setRegError(null);


            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            setIsSubmitting(false);

            if(error){
                setRegError(new Error(error.message));
                return;
            }

            navigate("/boards");
        }

    return(
        <div className={s.main}>
            <AuthForm 
            buttonText="Sign Up"
            headerText="Create Your Account"
            email={email}
            password={password}
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleRegister}
        />

        <Link to="/login">Already have account?</Link>

        {regError && <ErrorModalWindow error={regError} onClose={() => setRegError(null)} />}
        </div>
        
    )
}

export default RegPage;