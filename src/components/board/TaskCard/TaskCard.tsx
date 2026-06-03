import { useDraggable } from "@dnd-kit/react";

import s from './TaskCard.module.css'

function TaskCard(id: any){

    const {ref} = useDraggable(id);

    return (
        <div ref={ref}>
            NewTask
        </div>
    )
}

export default TaskCard;