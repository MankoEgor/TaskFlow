import type { Task } from '../types/tasks.type';
import type {Column} from "../types/column.type";
import type { KanbanItems, MoveTaskInput } from '../types/kanban.type';



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

export function getTaskMoveInput(
    items: KanbanItems,
    taskId: string,
    targetColumnId: string,
): MoveTaskInput | null {
    const targetIndex = (items[targetColumnId] ?? []).findIndex(
        (task) => task.id === taskId,
    );

    if (targetIndex < 0) {
        return null;
    }

    return {
        taskId,
        targetColumnId,
        targetIndex,
    };
}

export function hasSameTaskOrder(
    currentItems: KanbanItems,
    nextItems: KanbanItems,
): boolean {
    const columnIds = Object.keys(currentItems);

    if (columnIds.length !== Object.keys(nextItems).length) {
        return false;
    }

    return columnIds.every((columnId) => {
        const currentTasks = currentItems[columnId] ?? [];
        const nextTasks = nextItems[columnId] ?? [];

        return currentTasks.length === nextTasks.length
            && currentTasks.every(
                (task, index) => task.id === nextTasks[index]?.id,
            );
    });
}

export function applyTaskMove(
    tasks: Task[],
    input: MoveTaskInput,
): Task[] {
    const movingTask = tasks.find((task) => task.id === input.taskId);

    if (!movingTask) {
        return tasks;
    }

    const sourceColumnId = movingTask.column_id;
    const affectedColumnIds = new Set([
        sourceColumnId,
        input.targetColumnId,
    ]);
    const tasksByColumn = new Map<string, Task[]>();

    affectedColumnIds.forEach((columnId) => {
        tasksByColumn.set(
            columnId,
            tasks
                .filter(
                    (task) => task.column_id === columnId
                        && task.id !== input.taskId,
                )
                .sort(
                    (firstTask, secondTask) =>
                        firstTask.position - secondTask.position
                        || firstTask.id.localeCompare(secondTask.id),
                ),
        );
    });

    const targetTasks = tasksByColumn.get(input.targetColumnId) ?? [];
    const targetIndex = Math.min(
        Math.max(input.targetIndex, 0),
        targetTasks.length,
    );

    targetTasks.splice(targetIndex, 0, {
        ...movingTask,
        column_id: input.targetColumnId,
    });
    tasksByColumn.set(input.targetColumnId, targetTasks);

    const taskUpdates = new Map<string, { columnId: string; position: number }>();

    tasksByColumn.forEach((columnTasks, columnId) => {
        columnTasks.forEach((task, position) => {
            taskUpdates.set(task.id, { columnId, position });
        });
    });

    let hasChanges = false;
    const nextTasks = tasks.map((task) => {
        const update = taskUpdates.get(task.id);

        if (
            !update
            || (
                task.column_id === update.columnId
                && task.position === update.position
            )
        ) {
            return task;
        }

        hasChanges = true;

        return {
            ...task,
            column_id: update.columnId,
            position: update.position,
        };
    });

    return hasChanges ? nextTasks : tasks;
}
