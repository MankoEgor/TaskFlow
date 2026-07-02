import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { useState, useRef } from "react";

import s from './ProfilePage.module.css'

function ProfilePage(){

    const {user} = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        profileInfo, 
        uploadAvatar, 
        isUploaded
    } = useProfile(user?.id);

    const [error, setError] = useState<string>('');

    const handlearProfileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if(!file) return;

        setError('');

        try{
            await uploadAvatar(file)
        } catch(error) {
            if(error instanceof Error){
                setError(error.message);
                return 
            }

            setError('Failed to upload avatar')
        } finally {
            event.target.value = '';
        }
    };

    const fallbackLetter = user?.email?.[0].toUpperCase() ?? '?';



    return(
        <div className={s.container}>
            <div className={s.info}>
                { profileInfo?.url 
                    ? <img className={s.profileImage} src={profileInfo.url} alt="" /> 
                    : <span className={s.fallback}>{fallbackLetter}</span>
                }
                <button className={s.changeAvatarButton}>
                    <p>Change Avatar</p>
                </button>
                <input 
                    className={s.nameChange}
                    type="text" 
                    placeholder={profileInfo?.name} />
            </div>
        </div>
        
    )
}

export default ProfilePage;