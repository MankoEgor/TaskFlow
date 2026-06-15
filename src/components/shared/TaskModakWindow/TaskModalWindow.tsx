import type { Task } from "../../../types/tasks.type"
import s from './TaskModalWindow.module.css'
import cross from '../../../assets/cross.svg'

interface TaskModalWindowProps {
    task: Task;
    setClose: (value: boolean) => void;
}

function TaskModalWindow({task, setClose} : TaskModalWindowProps){

    const priorityClass = {
        low: s.low,
        medium: s.medium,
        high: s.high,
    } as const;

    return(
        <div className={s.overlay}>
            <div className={s.backdrop}>
                <div className={s.content}>
                    <div className={s.modal}>
                        <div className={s.closeButton} onClick={() => setClose(false)}>
                            <img src={cross} alt="Close" />
                        </div>

                    <div className={s.taskInfo}>
                        <div className={s.container}>
                            <h3 className={s.label}>TASK TITLE</h3>
                            <h1 className={s.title}>{task.title}</h1>
                        </div>

                        
                        <div className={s.taskDetailse}>

                            <div className={s.container}>
                                <h3 className={s.label}>ASSIGNEE</h3>
                                <p className={s.assigneeText}>{task.assignee_id}</p>
                            </div>

                            <div className={s.container}>
                                <h3 className={s.label}>DEADLINE</h3>
                                <p className={s.deadlineText}>{task.due_date}</p>
                            </div>

                            <div className={s.container}>
                                <h3 className={s.label}>PRIORITY</h3>
                                <div className={priorityClass[task.priority]}>
                                    <p className={s.priorityText}>
                                        {task.priority.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={s.container}>
                            <h3 className={s.label}>DESRIPTION</h3>
                            <div className={s.descriptionDiv}>
                                <p className={s.descriptionText}>{task.description}</p>
                            </div>
                            
                        </div>
                    </div>

                            
                        

                        

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModalWindow;