import { useState } from "react";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import s from './RegPage.module.css'

function RegPage(){

        const [email, setEmail] = useState<string>("");
        const [password, setPassword] = useState<string>("");
        const [errorMessage, setErrorMessage] = useState<string>("");
        const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

        const navigate = useNavigate();

        const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            setIsSubmitting(true);
            setErrorMessage("");


            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            setIsSubmitting(false);

            if(error){
                setErrorMessage(error.message);
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
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleRegister}
        />

        <Link to="/login">Already have account?</Link>
        </div>
        
    )
}

export default RegPage;