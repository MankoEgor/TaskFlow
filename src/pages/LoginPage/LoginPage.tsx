import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { Link } from "react-router-dom";

import s from './LoginPage.module.css'

function LoginPage() {

    return(
        <div className={s.main}>
            <AuthForm
            headerText="Welcome Back"
            buttonText="Sign In"
            mode='login'
        />

        <Link className={s.regLink} to="/register">Create account</Link>
        </div>
        
    )
};

export default LoginPage;
