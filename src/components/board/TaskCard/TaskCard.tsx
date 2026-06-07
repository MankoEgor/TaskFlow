import { useSortable } from "@dnd-kit/react/sortable";
import type { Task } from "../../../types/tasks.type";
import deleteIcon from '../../../assets/delete.svg'

import s from './TaskCard.module.css';

interface TaskCardProps {
    task: Task;
    index: number;
    deleteTask: (taskId: string) => void;
    isDeleted: boolean;
}

function TaskCard({task, index, deleteTask, isDeleted}: TaskCardProps){

  const {ref} = useSortable({
    id: task.id,
    index,
    data: {
      type: 'task',
      taskId: task.id,
      columnId: task.column_id
    }
  })

    return (
      <div ref={ref}
          className={s.taskContainer}>
          <button className={s.actionButton}>
            <img onClick={() => deleteTask(task.id)} 
                  src={deleteIcon} alt="Delete" />
            {/* <img src="" alt="" /> */}
          </button>
          <div className={s.taskHeader}>
              <h3 className={s.taskName}>{task.title}</h3>
              <p className={s.taskPriority}>{task.priority.toUpperCase()}</p>
          </div>
          <p className={s.taskDescription}>{task.description}</p>
      </div>
    )
}

export default TaskCard;