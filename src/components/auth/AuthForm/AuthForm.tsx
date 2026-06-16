import s  from './AuthForm.module.css';
import { useForm } from 'react-hook-form'
import { supabase } from '../../../lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {acceptPendingInvites} from '../../../services/boardInvites.service'

type AuthMode = 'login' | 'register';

type AuthFormValues = {
  email: string;
  password: string;
};

type AuthFormProps = {
  mode: AuthMode;
  headerText: string;
  buttonText: string;
};

function AuthForm({ 
    headerText, 
    buttonText, 
    mode
}: AuthFormProps){
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string>('');

    const {
        register, 
        handleSubmit, 
        formState: {errors, isSubmitting}
    } = useForm<AuthFormValues>({
        defaultValues: {
            email: '', 
            password: '', 
        }
    })


    const onSubmit = async (values: AuthFormValues) => {
        setServerError('');

        const email = values.email.trim();
        const password = values.password;

        if(mode === 'register'){
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });


            if (error) {
                setServerError(error.message);
                return;
            }


            const acceptedBoardId = await acceptPendingInvites();

                if (acceptedBoardId) {
                    navigate(`/board/${acceptedBoardId}`);
                    return;
                }
        }

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(error){
            setServerError(error.message);
            return;
        }

        const acceptedBoardId = await acceptPendingInvites();

        if (acceptedBoardId) {
            navigate(`/board/${acceptedBoardId}`);
            return;
        }

        navigate('/board');

    }

    return (
        
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <h1 className={s.title}>{headerText}</h1>

            <label className={s.label} htmlFor="email">Email Address</label>
            <input className={s.input}
                type="email" 
                id="email" 
                {...register('email', {
                    required:"Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address'
                    }
                })}
                placeholder="example@domain.com"/>
            {errors.email && <p className={s.error}>{errors.email.message}</p>}
            
            <label className={s.label} htmlFor="password">Password</label>
            <input className={s.input}
                type="password" 
                id="password" 
                {...register('password', {
                    required: "Passwors is required",
                    minLength: 
                        mode === 'register' 
                            ? {
                                value: 8,
                                message: "Passwor must be at least 6 characters",
                            }
                            : undefined
                })}
                placeholder="Minimum 8 characters" 
                />
            {errors.password && <p className={s.error}>{errors.password.message}</p>}

            {serverError && <p className={s.error}>{serverError}</p>}


            <button className={s.subButton} type="submit" disabled={isSubmitting}>
                {buttonText}
            </button>
        </form>
    )
}

export default AuthForm;