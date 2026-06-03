import { useDroppable } from '@dnd-kit/react';
import s from './ColumnBoard.module.css'
import addIcon from '../../assets/addTask.svg'


function ColumnBoard({id, title}: any){

    const {ref} = useDroppable({id: id})
    return(
        <div ref={ref} className={s.column}>
            <div className={s.header}>
                <h1 className={s.title}>{title}</h1>
            </div>
            <div className={s.content}>

            </div>
            <button className={s.addButton}>
                <img className={s.buttonIcon} src={addIcon} alt="" />
                <p className={s.buttonText}>Add Task</p>
            </button>
        </div>
    )
}

export default ColumnBoard;