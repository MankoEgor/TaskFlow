import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { Link } from "react-router-dom";

import s from './RegPage.module.css'

function RegPage(){

    return(
        <div className={s.main}>
            <AuthForm 
            mode="register"
            buttonText="Sign Up"
            headerText="Create Your Account"/>

        <Link to="/login">Already have account?</Link>
        </div>
        
    )
}

export default RegPage;