import { useDraggable } from "@dnd-kit/react";

import s from './TaskCard.module.css';

interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    priority: string;
}

function TaskCard({id, title, description, priority}: TaskCardProps){

    const {ref} = useDraggable({id: id});

    return (
        <div className={s.taskContainer} ref={ref}>
            <div className={s.taskHeader}>
                <h3 className={s.taskName}>{title}</h3>
                <div className={s.taskPriority}>{priority}</div>
            </div>
            <p className={s.taskDescription}>{description}</p>
        </div>
    )
}

export default TaskCard;