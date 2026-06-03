import { useDroppable } from '@dnd-kit/react';
import s from './ColumnBoard.module.css'

// import type { Column } from "../../types/column.type";

function ColumnBoard({id, board_id, title}: any){

    const {isDropTarget, ref} = useDroppable({id: id})
    return(
        <div ref={ref} className={s.column}>
            <h1>{title}</h1>
            {isDropTarget ? <p>Draggable element is over me</p> : <p>Drag something over me</p>}
        </div>
    )
}

export default ColumnBoard;