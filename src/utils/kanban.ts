import type { Task } from '../types/tasks.type';
import type {Column} from "../types/column.type";
import type {
    KanbanItems,
    TaskPositionUpdate
} from '../types/kanban.type';



export function groupTasksByColumn(
    columns: Column[],
    tasks: Task[],
): KanbanItems {

    const groupedTasks: KanbanItems = {};

    columns.forEach((column) => {
        groupedTasks[column.id] = [];
    });

    tasks.forEach((task) => {
        if(!groupedTasks[task.column_id]) {
            groupedTasks[task.column_id] = [];
        }

        groupedTasks[task.column_id].push(task);
    });

    Object.values(groupedTasks).forEach((tasks) => {
        tasks.sort((a, b) => a.position - b.position);
    });

    return groupedTasks;        
}


export function normalizePositions(
    items: KanbanItems,
    columnIds: string[]
): TaskPositionUpdate[] {
    return columnIds.flatMap((columnId) =>
        (items[columnId] ?? []).map((task, index) => ({
            id: task.id,
            column_id: columnId,
            position: index,
        }))
    );
}