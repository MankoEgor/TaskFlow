import { useSortable } from "@dnd-kit/react/sortable";
import type { Task, UpdateTaskInput } from "../../../types/tasks.type";
import type { BoardMember } from "../../../types/members.type";
import deleteIcon from '../../../assets/delete.svg'

import s from './TaskCard.module.css';
import { useState } from "react";
import { toast } from "sonner";
import TaskModalWindow from "../../shared/TaskModalWindow/TaskModalWindow";
import { toError } from "../../../utils/errors";
import ProfileIcon from "../../shared/ProfileIcon/ProfileIcon";

interface TaskCardProps {
    task: Task;
    index: number;
    deleteTask: (taskId: string) => void;
    isDeleted: boolean;
    members: BoardMember[];
    updateTask: (input: UpdateTaskInput) => Promise<void>;
    isUpdating: boolean;
    assignee: BoardMember | undefined;
    currentColumnId: string;
}

function TaskCard({
  task,
  index,
  deleteTask,
  members,
  updateTask,
  isUpdating,
  assignee,
  currentColumnId,
}: TaskCardProps){

  const [isClicked, setIsClicked] = useState<boolean>(false)

  const {ref} = useSortable({
    id: task.id,
    index,
    type: 'task',
    accept: 'task',
    group: currentColumnId,
    data: {
      type: 'task',
      taskId: task.id,
      columnId: currentColumnId
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
                    toast.error(toError(error, 'Failed to delete task').message);
                  }
                }
              }>
              <img className={s.actionIcon}
                  src={deleteIcon} alt="Delete" />
            </button>
            <p className={s.taskPriority}>{task.priority.toUpperCase()}</p>
          </div>
          <div className={s.content}>
            <div className={s.taskInfo}>
                <div className={s.taskHeader}>
                  <h3 className={s.taskName}>{task.title}</h3>
                </div>

                <p className={s.taskDescription}>{task.description}</p>
            </div>
            
            {task.assignee_id && (
              <div
                className={s.taskAssignee}
                title={`Assigned to ${assignee?.name ?? 'Unknown user'}`}>
                <ProfileIcon
                  name={assignee?.name ?? 'Unknown user'}
                  avatarUrl={assignee?.avatar_url ?? null}/>
              </div>
            )}
          </div>
        </div>

        {isClicked && (
          <TaskModalWindow
            task={task}
            members={members}
            assignee={assignee}
            updateTask={updateTask}
            isUpdating={isUpdating}
            setClose={setIsClicked}
          />
        )}
      </>

    )
}

export default TaskCard;
