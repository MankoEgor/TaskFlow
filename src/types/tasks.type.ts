export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: string;
    column_id: string;
    title: string;
    description: string | null;
    priority: TaskPriority;
    due_date: string | null;
    assignee_id: string | null;
    position: number;
    created_by: string;
    created_at: string;

}

type EditableTaskFields = Pick<
  Task,
  | 'title'
  | 'description'
  | 'priority'
  | 'due_date'
  | 'assignee_id' 
>


export type CreateTaskInput = EditableTaskFields & {
    column_id: string;
    created_by: string;
};

export type UpdateTaskInput = EditableTaskFields & {
    taskId: string;
};

export type TaskFormValues = {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    assigneeId: string;
};

