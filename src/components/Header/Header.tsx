import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useNavigate } from 'react-router-dom';

import s from './Header.module.css'
import icon from '../../assets/Icon.svg'
import logout from '../../assets/logout.svg'
import ProfileIcon from '../shared/ProfileIcon/ProfileIcon';
import ErrorModalWindow from '../shared/ErrorModalWindow/ErrorModalWindow';



function Header(){

    const navigate = useNavigate()

    const {user, signOut } = useAuth();
    const {profileInfo, error } = useProfile(user?.id);
    const [quare, setQuare] = useState<string>('');

    function headleQuere(value: string) {
        setQuare(value)
    }

    const handleSignOut = async () => {
        await signOut();
    }

    if(error){
        return <ErrorModalWindow error={error}/>
    }

    return (
        <header className={s.header}>
            <div className={s.logoAndSearch}>
                <div className={s.logoContainer}>
                    <img src={icon} alt="icon" />
                    <h1 className={s.logo}>TaskFlow</h1>
                </div>

                <input className={s.search}
                    type="text" 
                    name="" 
                    id="" 
                    placeholder='Search a board'
                    value={quare}
                    onChange={(e) => headleQuere(e.target.value)}
                    />
            </div>

        <div className={s.profileAndSignOut}>

            <ProfileIcon
                name={profileInfo?.name!}
                avatarUrl={profileInfo?.avatar_url!}
                onClick={() => navigate(`profile/${user?.id}`)}/>
            <button className={s.signOut} onClick={handleSignOut}>
                Sign Out
                <img src={logout} alt="Logout" />
            </button>
        </div>
            
        </header>
    )
}

export default Header;