import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth';


import s from './Header.module.css'
import icon from '../../assets/Icon.svg'
import logout from '../../assets/logout.svg'
import { useProfile } from '../../hooks/useProfile';
import ErrorModalWindow from '../shared/ErrorModalWindow/ErrorModalWindow';
import { useNavigate } from 'react-router-dom';



function Header(){

    const {user, signOut } = useAuth();
    const {profileInfo, error} = useProfile(user?.id)

    const [quare, setQuare] = useState<string>('');

    const navigate = useNavigate()

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

            <div onClick={() => navigate(`/profile/${user?.id}`)} className={s.profile}>
                <img src={profileInfo?.url} alt="" />
                <h3>{profileInfo?.name}</h3>
            </div>

            <button className={s.signOut} onClick={handleSignOut}>
                Sign Out
                <img src={logout} alt="Logout" />
            </button>
        </div>
            
        </header>
    )
}

export default Header;