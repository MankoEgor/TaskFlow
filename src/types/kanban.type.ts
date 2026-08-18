import type { Task } from '../types/tasks.type';

export type KanbanItems = Record<string, Task[]>;

export type MoveTaskInput = {
    taskId: string;
    targetColumnId: string;
    targetIndex: number;
};
