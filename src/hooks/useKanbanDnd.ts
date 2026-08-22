import { useCallback, useMemo, useState } from 'react';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/dom';
import { move } from '@dnd-kit/helpers';

import type { Column } from '../types/column.type';
import type { Task } from '../types/tasks.type';
import type { KanbanItems, MoveTaskInput } from '../types/kanban.type';
import {
    getTaskMoveInput,
    groupTasksByColumn,
    hasSameTaskOrder,
} from '../utils/kanban';
import { toError } from '../utils/errors';


type UseKanbanDndParams = {
    columns: Column[];
    tasks: Task[];
    moveTask: (input: MoveTaskInput) => Promise<void>;
    onError: (error: Error) => void;
};

export function useKanbanDnd({
    columns,
    tasks,
    moveTask,
    onError,
}: UseKanbanDndParams) {
    const groupedItems = useMemo(
        () => groupTasksByColumn(columns, tasks),
        [columns, tasks]
    );

    const [dragItems, setDragItems] = useState<KanbanItems | null>(null);

    const items = dragItems ?? groupedItems;


    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            const { source } = event.operation;

            if (source?.type !== 'task') {
                return;
            }

            setDragItems((currentItems) => {
                const baseItems = currentItems ?? groupedItems;
                const nextItems = move(baseItems, event);

                return hasSameTaskOrder(baseItems, nextItems)
                    ? currentItems
                    : nextItems;
            });
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

            const targetColumnId =
                target?.data?.columnId as string | undefined;

            if (
                !taskId 
                || !targetColumnId
                || !source 
                || !target 
                || source.type !== 'task') {

                setDragItems(null);
                return;
            }

            const moveInput = getTaskMoveInput(
                dragItems ?? groupedItems,
                taskId,
                targetColumnId,
            );

            if (!moveInput) {
                setDragItems(null);
                return;
            }

            try {
                await moveTask(moveInput);
            } catch (error: unknown) {
                onError(toError(error, 'Failed to move task'));
            } finally {
                setDragItems(null);
            }
        },
        [dragItems, groupedItems, moveTask, onError],
    );

    return {
        items,
        handleDragOver,
        handleDragEnd,
    };
}
