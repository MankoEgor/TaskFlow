export type Task = {
    id: string;
    column_id: string;
    title: string;
    description: string;
    priority: string;
    due_date: string;
    assignee_id: string;
    position: number;
    created_by: string;
    create_at: string;

}

export type TaskPriority = 'low' | 'medium' | 'high';

export type CreateTaskInput = {
  column_id: string;
  title: string;
  created_by: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
  assignee_id?: string | null;
};