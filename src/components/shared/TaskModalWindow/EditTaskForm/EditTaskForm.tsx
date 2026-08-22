import { useForm } from "react-hook-form";

import type { Task, TaskFormValues } from "../../../../types/tasks.type";
import type { BoardMember } from "../../../../types/members.type";

import { getTaskFormValues } from "../../../../utils/task";

import s from "../TaskModalWindow.module.css";

interface EditTaskFormProps {
  task: Task;
  members: BoardMember[];
  isUpdating: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
}

function EditTaskForm({
  task,
  members,
  isUpdating,
  onSubmit,
  onCancel,
}: EditTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TaskFormValues>({
    defaultValues: getTaskFormValues(task),
  });

  const today = new Date().toISOString().slice(0, 10);
  const submitting = isUpdating || isSubmitting;

  return (
    <form className={s.editForm} onSubmit={handleSubmit(onSubmit)}>
      <label className={s.field}>
        <span className={s.label}>TASK TITLE</span>
        <input
          className={s.formControl}
          type="text"
          {...register("title", {
            required: "Task title is required",
            validate: (value) =>
              value.trim().length > 0 || "Task title is required",
          })}
        />
        {errors.title && <p className={s.error}>{errors.title.message}</p>}
      </label>

      <div className={s.editDetails}>
        <label className={s.field}>
          <span className={s.label}>ASSIGNEE</span>
          <select className={s.formControl} {...register("assigneeId")}>
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name ?? "Unnamed member"}
              </option>
            ))}
          </select>
        </label>

        <label className={s.field}>
          <span className={s.label}>DEADLINE</span>
          <input
            className={s.formControl}
            type="date"
            {...register("dueDate", {
              validate: (value) =>
                !value ||
                value >= today ||
                value === task.due_date ||
                "Due date cannot be in the past",
            })}
          />
          {errors.dueDate && (
            <p className={s.error}>{errors.dueDate.message}</p>
          )}
        </label>

        <label className={s.field}>
          <span className={s.label}>PRIORITY</span>
          <select className={s.formControl} {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label className={s.field}>
        <span className={s.label}>DESCRIPTION</span>
        <textarea
          className={s.descriptionInput}
          rows={4}
          {...register("description")}
        />
      </label>

      <div className={s.formActions}>
        <button
          className={s.cancelButton}
          type="button"
          disabled={submitting}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className={s.saveButton}
          type="submit"
          disabled={submitting || !isDirty}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;
