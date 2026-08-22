import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import s from './Header.module.css'
import icon from '../../assets/Icon.svg'
import logout from '../../assets/logout.svg'
import ProfileIcon from '../shared/ProfileIcon/ProfileIcon';
import ErrorModalWindow from '../shared/ErrorModalWindow/ErrorModalWindow';
import { toError } from '../../utils/errors';



function Header(){

    const navigate = useNavigate()

    const {user, signOut } = useAuth();
    const {profileInfo, error } = useProfile(user?.id);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error: unknown) {
            toast.error(toError(error, 'Failed to sign out').message);
        }
    }

    if(error){
        return <ErrorModalWindow error={error}/>
    }

    const profileName = profileInfo?.name ?? user?.email ?? 'User';
    const profileAvatarUrl = profileInfo?.avatar_url ?? null;

    return (
        <header className={s.header}>
            <div className={s.logoContainer}>
                <img src={icon} alt="icon" />
                <h1 className={s.logo}>TaskFlow</h1>
            </div>

        <div className={s.profileAndSignOut}>

            <ProfileIcon
                name={profileName}
                avatarUrl={profileAvatarUrl}
                onClick={() => navigate(`profile/${user?.id}`)}/>
            <button
                className={s.signOut}
                type="button"
                title="Sign out"
                aria-label="Sign out"
                onClick={handleSignOut}>
                Sign Out
                <img src={logout} alt="Logout" />
            </button>
        </div>
            
        </header>
    )
}

export default Header;
