import { useState } from "react";

import type { BoardMember } from "../../../types/members.type";
import type {
  Task,
  TaskFormValues,
  UpdateTaskInput,
} from "../../../types/tasks.type";

import { toError } from "../../../utils/errors";

import ErrorModalWindow from "../ErrorModalWindow/ErrorModalWindow";
import TaskDetails from "./TaskDetails/TaskDetails";
import EditTaskForm from "./EditTaskForm/EditTaskForm";
import TaskComments from "./TaskComments/TaskComments";

import cross from "../../../assets/cross.svg";
import editIcon from "../../../assets/edit.svg";

import s from "./TaskModalWindow.module.css";

interface TaskModalWindowProps {
  task: Task;
  members: BoardMember[];
  assignee: BoardMember | undefined;
  updateTask: (input: UpdateTaskInput) => Promise<void>;
  isUpdating: boolean;
  setClose: (value: boolean) => void;
}

function TaskModalWindow({
  task,
  members,
  assignee,
  updateTask,
  isUpdating,
  setClose,
}: TaskModalWindowProps) {
  const [editingMode, setEditingMode] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);

  const handleEdit = () => {
    setEditingMode(true);
  };

  const onSubmit = async (values: TaskFormValues) => {
    const normalizedValues = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    };

    try {
      await updateTask({
        taskId: task.id,
        title: normalizedValues.title,
        description: normalizedValues.description || null,
        priority: normalizedValues.priority,
        due_date: normalizedValues.dueDate || null,
        assignee_id: normalizedValues.assigneeId || null,
      });

      setEditingMode(false);
    } catch (updateError: unknown) {
      setLocalError(toError(updateError, "Failed to update task"));
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.backdrop}>
        <div className={s.content}>
          <div className={s.modal}>
            <div className={s.modalActions}>
              {!editingMode && (
                <button
                  className={s.iconButton}
                  type="button"
                  title="Edit task"
                  aria-label="Edit task"
                  onClick={handleEdit}
                >
                  <img src={editIcon} alt="" />
                </button>
              )}
              <button
                className={s.iconButton}
                type="button"
                title="Close"
                aria-label="Close task"
                onClick={() => setClose(false)}
              >
                <img src={cross} alt="" />
              </button>
            </div>

            <div className={s.taskInfo}>
              {editingMode ? (
                <EditTaskForm
                  task={task}
                  members={members}
                  isUpdating={isUpdating}
                  onSubmit={onSubmit}
                  onCancel={() => setEditingMode(false)}
                />
              ) : (
                <TaskDetails task={task} assignee={assignee} />
              )}

              <TaskComments taskId={task.id} onError={setLocalError} />
            </div>

            {localError && (
              <ErrorModalWindow
                error={localError}
                onClose={() => setLocalError(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModalWindow;
