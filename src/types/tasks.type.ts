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

export type CreateTaskInput = {
  column_id: string;
  title: string;
  created_by: string;
  description?: string | null;
  priority: TaskPriority;
  due_date?: string | null;
  assignee_id?: string | null;
};
