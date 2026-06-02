import { useState } from 'react'

import s from './Header.module.css'
import icon from '../../assets/icon.svg'


function Header(){

    const [quare, setQuare] = useState<string>('');

    function headleQuere(value: string) {
        setQuare(value)
    }

    return (
        <header className={s.header}>
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
                onChange={() => headleQuere(quare)}
                />


        </header>
    )
}

export default Header;