import { useSortable } from "@dnd-kit/react/sortable";

import s from './TaskCard.module.css';

interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    priority: string;
    index: number;
    columnId: string;
}

function TaskCard({id, title, description, priority, index, columnId}: TaskCardProps){

  const {ref, isDragging} = useSortable({
    id, 
    index, 
    type: 'item',
    accept: 'item',
    group: columnId});

    return (
      <div ref={ref} className={s.taskContainer} data-dragging={isDragging}>
          <div className={s.taskHeader}>
              <h3 className={s.taskName}>{title}</h3>
              <p className={s.taskPriority}>{priority.toUpperCase()}</p>
          </div>
          <p className={s.taskDescription}>{description}</p>
      </div>
    )
  }

export default TaskCard;