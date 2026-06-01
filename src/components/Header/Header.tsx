import { useState } from 'react'

import s from './Header.module.css'


function Header(){

    const [quare, setQuare] = useState<string>('');

    function headleQuere(value: string) {
        setQuare(value)
    }

    return (
        <header className={s.header}>
            <h1 className={s.logo}>TaskFlow</h1>

            <input 
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