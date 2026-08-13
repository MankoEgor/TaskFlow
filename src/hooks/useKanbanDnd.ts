import { useCallback, useMemo, useRef, useState } from 'react';
import { move } from '@dnd-kit/helpers';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent
} from '@dnd-kit/dom';

import type { Column } from '../types/column.type';
import type { Task } from '../types/tasks.type';
import type { KanbanItems, TaskPositionUpdate } from '../types/kanban.type';
import {
    groupTasksByColumn,
    normalizePositions,
} from '../utils/kanban';
import { toError } from '../utils/errors';


type UseKanbanDndParams = {
    columns: Column[];
    tasks: Task[];
    saveTaskPositions: (
        tasks: TaskPositionUpdate[]
    ) => Promise<void>;
};

export function useKanbanDnd({
    columns,
    tasks,
    saveTaskPositions,
}: UseKanbanDndParams) {
    const groupedItems = useMemo(
        () => groupTasksByColumn(columns, tasks),
        [columns, tasks]
    );

    const [dragItems, setDragItems] = useState<KanbanItems | null>(null);
    const [dndError, setDndError] = useState<Error | null>(null);

    const items = dragItems ?? groupedItems;

    const sourceColumnRefId = useRef<string | null>(null);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        sourceColumnRefId.current = event.operation.source?.data?.columnId ?? null;
    }, []);

    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            const { source } = event.operation;

            if (source?.type !== 'task') {
                return;
            }

            setDragItems((currentItems) =>
                move(currentItems ?? groupedItems, event)
            );
        },
        [groupedItems]
    );

    const handleDragEnd = useCallback(
        async (event: DragEndEvent) => {
            if (event.canceled) {
                setDragItems(null);
                return;
            }

            const { source, target } = event.operation;


            const taskId =
                source?.data?.taskId as string | undefined;

            const sourceColumnId = sourceColumnRefId.current;

            const targetColumnId =
                target?.data?.columnId as string | undefined;

            if (
                !taskId 
                || !sourceColumnId 
                || !targetColumnId
                || !source 
                || !target 
                || source.type !== 'task') {

                setDragItems(null);
                sourceColumnRefId.current = null;
                return;
            }

            const finalItems = dragItems ?? groupedItems;
            const affectedColumnIds =
            sourceColumnId === targetColumnId
                ? [sourceColumnId]
                : [sourceColumnId, targetColumnId];

        const normalizedTasks = normalizePositions(
            finalItems,
            affectedColumnIds
        );

        const changedTasks = normalizedTasks.filter(
            (update) => {
                const originalTask = tasks.find(
                    (task) => task.id === update.id
                );

                return (
                    !originalTask ||
                    originalTask.column_id !== update.column_id ||
                    originalTask.position !== update.position
                );
            }
        );

        try {
            if (changedTasks.length > 0) {
                await saveTaskPositions(changedTasks);
            }
        } catch (error: unknown) {
            setDndError(
                toError(error, 'Failed to move task')
            );
        } finally {
            setDragItems(null);
            sourceColumnRefId.current = null;
        }
    },
    [
        dragItems,
        groupedItems,
        tasks,
        saveTaskPositions,
    ]
    );
        return {
        items,
        dndError,
        clearDndError: () => setDndError(null),
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}
