import { useDroppable } from '@dnd-kit/react';
import s from './ColumnBoard.module.css'

import type { Column } from "../../types/column.type";

function Column({id, board_id, title, position}: Column){

    const {isDropTarget, ref} = useDroppable({id: id})
    return(
        <div ref={ref} className={s.column}>
            <h1>{title}</h1>
            {isDropTarget ? 'Draggable element is over me' : 'Drag something over me'}
        </div>
    )
}

export default Column;