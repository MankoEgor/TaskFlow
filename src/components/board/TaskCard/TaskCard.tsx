import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import s from './TaskCard.module.css';

interface TaskCardProps {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    index: number;
    columnId: string;
}

function TaskCard({id, title, description, priority, index, columnId}: TaskCardProps){

  const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: id,
    data: {
      type: 'task',
      taskId: id,
      columnId: columnId,
      index,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

    return (
      <div ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
         className={s.taskContainer} >
          <div className={s.taskHeader}>
              <h3 className={s.taskName}>{title}</h3>
              <p className={s.taskPriority}>{priority.toUpperCase()}</p>
          </div>
          <p className={s.taskDescription}>{description}</p>
      </div>
    )
}

export default TaskCard;