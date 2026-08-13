import type { Task } from '../types/tasks.type';

export type KanbanItems = Record<string, Task[]>;

export type TaskPositionUpdate = {
    id: string;
    column_id: string;
    position: number;
}