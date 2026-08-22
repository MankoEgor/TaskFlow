import type { Task, TaskFormValues } from "../types/tasks.type";  

export function getTaskFormValues(task: Task): TaskFormValues {
    return {
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        dueDate: task.due_date ?? '',
        assigneeId: task.assignee_id ?? '',
    };
}