import { useDroppable } from '@dnd-kit/react';
import { useTask } from '../../../hooks/useTask';
import type { Task } from '../../../types/tasks.type';

import TaskCard from '../TaskCard/TaskCard';

import s from './ColumnBoard.module.css'
import addIcon from '../../../assets/addTask.svg'




function ColumnBoard({id, title}: any){

    const {tasks} = useTask(id)

    const {ref} = useDroppable({id: id})
    return(
        <div ref={ref} className={s.column}>
            <div className={s.header}>
                <h1 className={s.title}>{title}</h1>
            </div>
            <div className={s.content}>
                {tasks.map((t: Task) => (
                    <TaskCard
                        id={t.id}
                        title={t.title}
                        description={t.description}
                        priority={t.priority}
                        />
                ))}
                    
            </div>
            <button className={s.addButton}>
                <img className={s.buttonIcon} src={addIcon} alt="" />
                <p className={s.buttonText}>Add Task</p>
            </button>
        </div>
    )
}

export default ColumnBoard;