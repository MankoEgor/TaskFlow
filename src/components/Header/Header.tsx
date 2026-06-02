import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth';


import s from './Header.module.css'
import icon from '../../assets/icon.svg'
import logout from '../../assets/logout.svg'



function Header(){

    const { signOut } = useAuth();

    const [quare, setQuare] = useState<string>('');

    function headleQuere(value: string) {
        setQuare(value)
    }

    const handleSignOut = async () => {
        await signOut();
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
            <button className={s.signOut} onClick={handleSignOut}>
                Sign Out
                <img src={logout} alt="Logout" />
            </button>
        </div>
            
        </header>
    )
}

export default Header;