import s from './NotFoundPage.module.css'
import boarsPageIcon from '../../assets/boarsPage.svg'
import { useNavigate } from 'react-router-dom';

function NotFoundPage(){

    const navigate = useNavigate()
    return(
        <div className={s.main}>
            <div className={s.content}>
                <div className={s.imageDiv}>

                </div>

                <div className={s.textDiv}>
                    <h1 className={s.header}>Oops! This page got lost in the flow</h1>
                    <p className={s.description}>
                        The task or board you are looking for might have been moved,<br />
                        renamed, or perhaps it never existed in this project's <br />
                        timeline.
                    </p>
                </div>

                <div className={s.buttonDiv}>
                    <button onClick={() => navigate('/board')} className={s.navButton}>
                        <img className={s.buttonIcon} src={boarsPageIcon} alt="" />
                        <p className={s.buttonText}>Back to Boards</p>
                    </button>   
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage;