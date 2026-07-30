import { useSortable } from "@dnd-kit/react/sortable";
import type { Task } from "../../../types/tasks.type";
import deleteIcon from '../../../assets/delete.svg'

import s from './TaskCard.module.css';
import { useState } from "react";
import TaskModalWindow from "../../shared/TaskModakWindow/TaskModalWindow";
import { toError } from "../../../utils/errors";

interface TaskCardProps {
    task: Task;
    index: number;
    deleteTask: (taskId: string) => void;
    isDeleted: boolean;
    onError?: (error: Error) => void;
}

function TaskCard({task, index, deleteTask, onError}: TaskCardProps){

  const [isClicked, setIsClicked] = useState<boolean>(false)

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
      <>

        <div ref={ref} className={s.taskContainer} onClick={() => setIsClicked(true)}>
          <div className={s.actionDiv}>
            <button 
              className={s.actionButton} 
              type="button"
              onClick={ async (event) => {
                event.stopPropagation();

                try {
                  await deleteTask(task.id);
                } catch (error: unknown) {
                    onError?.(toError(error, 'Failed to delete task'));
                  }
                }
              }>
              <img className={s.actionIcon}
                  src={deleteIcon} alt="Delete" />
            </button>
            <p className={s.taskPriority}>{task.priority.toUpperCase()}</p>
          </div>
          <div className={s.content}>
            <div className={s.taskHeader}>
              <h3 className={s.taskName}>{task.title}</h3>
            </div>
            <p className={s.taskDescription}>{task.description}</p>
          </div>
        </div>

        {isClicked && <TaskModalWindow task={task} setClose={setIsClicked}/>}
      </>

    )
}

export default TaskCard;
