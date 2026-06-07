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

function TaskCard({task, index, deleteTask}: TaskCardProps){

  const {ref} = useSortable({
    id: task.id,
    index,
    type: 'task',
    accept: 'task',
    group: task.column_id,
    data: {
      type: 'task',
      taskId: task.id,
      columnId: task.column_id
    }
  })

    return (
      <div ref={ref}
          className={s.taskContainer}>
          <div className={s.actionDiv}>
            <button className={s.actionButton} onClick={() => deleteTask(task.id)}>
              <img className={s.actionIcon}
                  src={deleteIcon} alt="Delete" />
            </button>
            <p className={s.taskPriority}>{task.priority.toUpperCase()}</p>
            {/* <img src="" alt="" /> */}
          </div>
          <div className={s.taskHeader}>
              <h3 className={s.taskName}>{task.title}</h3>
          </div>
          <p className={s.taskDescription}>{task.description}</p>
      </div>
    )
}

export default TaskCard;