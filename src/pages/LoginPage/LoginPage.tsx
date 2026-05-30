import { useState } from "react";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        setErrorMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }


        navigate("/boards");
    }

    return(
        <AuthForm
            buttonText="Sign In"
            email={email}
            password={password}
            headerText="Welcome Back"
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
        />
    )
};

export default LoginPage;
