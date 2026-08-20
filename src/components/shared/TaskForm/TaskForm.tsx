import type { Task } from "../../../types/tasks.type";
import type { BoardMember } from "../../../types/members.type";

import ProfileIcon from "../ProfileIcon/ProfileIcon";

import s from "../TaskModalWindow/TaskModalWindow.module.css";

interface TaskFormProps {
  task: Task;
  assignee: BoardMember | undefined;
}

function TaskForm({ task, assignee }: TaskFormProps) {
  const priorityClass = {
    low: s.low,
    medium: s.medium,
    high: s.high,
  } as const;

  return (
    <>
      <div className={s.container}>
        <h3 className={s.label}>TASK TITLE</h3>
        <h1 className={s.title}>{task.title}</h1>
      </div>

      <div className={s.taskDetailse}>
        <div className={s.container}>
          <h3 className={s.label}>ASSIGNEE</h3>
          <div className={s.assignee}>
            {assignee && (
              <ProfileIcon
                name={assignee.name ?? "Unknown user"}
                avatarUrl={assignee.avatar_url}
              />
            )}
            <p className={s.assigneeText}>{assignee?.name ?? "Unassigned"}</p>
          </div>
        </div>

        <div className={s.container}>
          <h3 className={s.label}>DEADLINE</h3>
          <p className={s.deadlineText}>{task.due_date ?? "No deadline"}</p>
        </div>

        <div className={s.container}>
          <h3 className={s.label}>PRIORITY</h3>
          <div className={priorityClass[task.priority]}>
            <p className={s.priorityText}>{task.priority.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className={s.container}>
        <h3 className={s.label}>DESCRIPTION</h3>
        <div className={s.descriptionDiv}>
          <p className={s.descriptionText}>
            {task.description ?? "No description"}
          </p>
        </div>
      </div>
    </>
  );
}

export default TaskForm;
