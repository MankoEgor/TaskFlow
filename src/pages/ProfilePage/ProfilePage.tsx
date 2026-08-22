import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Button from "../../components/shared/Button/Button";
import backIcon from '../../assets/arrow_back.svg'

import s from './ProfilePage.module.css';
import ErrorModalWindow from "../../components/shared/ErrorModalWindow/ErrorModalWindow";
import Loader from "../../components/shared/Loader/Loader";
import { toError } from "../../utils/errors";

function ProfilePage(){

    const navigate = useNavigate()

    const {user} = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        profileInfo, 
        uploadAvatar, 
        isUploaded,
        error: profileError,
        loading
    } = useProfile(user?.id);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if(!file) return;

        try{
            await uploadAvatar(file)
        } catch(error: unknown) {
            toast.error(toError(error, 'Failed to upload avatar').message);
        } finally {
            event.target.value = '';
        }
    };

    const fallbackLetter = profileInfo?.name?.[0]?.toUpperCase()
        ?? user?.email?.[0]?.toUpperCase()
        ?? '?';


    if(loading){
        return <Loader />
    }

    if(profileError){
        return <ErrorModalWindow
                    error={profileError}
                    onClose={() => navigate('/board')}
                />
    }


    return(
        <div className={s.container}>
            <Button 
                message="Back"
                icon={backIcon}
                onClick={() => navigate('/board')}
            />
            <div className={s.info}>
                { profileInfo?.avatar_url 
                    ? <img
                        className={s.profileImage}
                        src={profileInfo.avatar_url}
                        alt={profileInfo.name ?? 'Profile avatar'} />
                    : <span className={s.fallback}>{fallbackLetter}</span>
                }
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploaded}
                    className={s.changeAvatarButton}>
                    <p>Change Avatar</p>
                </button>
                
                <input
                    className={s.fileInput}
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}/>

                <p className={s.profileName}>
                    {profileInfo?.name ?? user?.email ?? 'Unknown user'}
                </p>
            </div>
        </div>
        
    )
}

export default ProfilePage;
