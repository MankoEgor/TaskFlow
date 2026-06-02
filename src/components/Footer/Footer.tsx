import s from './Footer.module.css'

function Footer(){
    return (
        <footer className={s.footer}>
            <p className={s.footerText}>© 2023 TaskFlow. All rights reserved.</p>
        </footer>
    )
        
}

export default Footer;