import { describe, expect, it } from 'vitest';

import type { Column } from '../types/column.type';
import type { Task } from '../types/tasks.type';
import {
    applyTaskMove,
    getTaskMoveInput,
    groupTasksByColumn,
    hasSameTaskOrder,
} from './kanban';

const columns: Column[] = [
    { id: 'todo', board_id: 'board-1', title: 'To Do', position: 0 },
    { id: 'done', board_id: 'board-1', title: 'Done', position: 1 },
];

function createTask(
    id: string,
    columnId: string,
    position: number,
): Task {
    return {
        id,
        column_id: columnId,
        title: `Task ${id}`,
        description: null,
        priority: 'medium',
        due_date: null,
        assignee_id: null,
        position,
        created_by: 'user-1',
        created_at: '2026-01-01T00:00:00.000Z',
    };
}

function getOrderedTaskIds(tasks: Task[], columnId: string): string[] {
    return tasks
        .filter((task) => task.column_id === columnId)
        .sort((firstTask, secondTask) => firstTask.position - secondTask.position)
        .map((task) => task.id);
}

function getColumnPositions(tasks: Task[], columnId: string): number[] {
    return tasks
        .filter((task) => task.column_id === columnId)
        .map((task) => task.position)
        .sort((firstPosition, secondPosition) => firstPosition - secondPosition);
}

describe('groupTasksByColumn', () => {
    it('groups tasks, sorts them by position, and keeps empty columns', () => {
        const tasks = [
            createTask('second', 'todo', 1),
            createTask('first', 'todo', 0),
        ];

        const result = groupTasksByColumn(columns, tasks);

        expect(result.todo.map((task) => task.id)).toEqual(['first', 'second']);
        expect(result.done).toEqual([]);
    });
});

describe('getTaskMoveInput', () => {
    it('returns the task index from the current drag state', () => {
        const items = {
            todo: [createTask('first', 'todo', 0)],
            done: [
                createTask('second', 'done', 0),
                createTask('moving', 'done', 1),
            ],
        };

        expect(getTaskMoveInput(items, 'moving', 'done')).toEqual({
            taskId: 'moving',
            targetColumnId: 'done',
            targetIndex: 1,
        });
    });

    it('returns null when the task is absent from the target column', () => {
        const items = {
            todo: [createTask('first', 'todo', 0)],
            done: [],
        };

        expect(getTaskMoveInput(items, 'missing', 'done')).toBeNull();
    });
});

describe('hasSameTaskOrder', () => {
    it('compares task order without depending on task object references', () => {
        const currentItems = {
            todo: [createTask('first', 'todo', 0)],
            done: [],
        };
        const nextItems = {
            todo: [{ ...currentItems.todo[0], title: 'Updated title' }],
            done: [],
        };

        expect(hasSameTaskOrder(currentItems, nextItems)).toBe(true);
        expect(
            hasSameTaskOrder(currentItems, {
                todo: [],
                done: [createTask('first', 'done', 0)],
            }),
        ).toBe(false);
    });
});

describe('applyTaskMove', () => {
    it('reorders a task inside one column and normalizes positions', () => {
        const tasks = [
            createTask('first', 'todo', 0),
            createTask('second', 'todo', 1),
            createTask('third', 'todo', 2),
        ];

        const result = applyTaskMove(tasks, {
            taskId: 'third',
            targetColumnId: 'todo',
            targetIndex: 0,
        });

        expect(getOrderedTaskIds(result, 'todo')).toEqual([
            'third',
            'first',
            'second',
        ]);
        expect(getColumnPositions(result, 'todo')).toEqual([0, 1, 2]);
        expect(tasks.map((task) => task.position)).toEqual([0, 1, 2]);
    });

    it('moves a task between columns and normalizes both columns', () => {
        const tasks = [
            createTask('first', 'todo', 0),
            createTask('moving', 'todo', 1),
            createTask('third', 'todo', 2),
            createTask('done-first', 'done', 0),
            createTask('done-second', 'done', 1),
        ];

        const result = applyTaskMove(tasks, {
            taskId: 'moving',
            targetColumnId: 'done',
            targetIndex: 1,
        });

        expect(getOrderedTaskIds(result, 'todo')).toEqual(['first', 'third']);
        expect(getColumnPositions(result, 'todo')).toEqual([0, 1]);
        expect(getOrderedTaskIds(result, 'done')).toEqual([
            'done-first',
            'moving',
            'done-second',
        ]);
        expect(getColumnPositions(result, 'done')).toEqual([0, 1, 2]);
    });

    it('clamps target indexes to the beginning and end of a column', () => {
        const tasks = [
            createTask('moving', 'todo', 0),
            createTask('done-first', 'done', 0),
            createTask('done-second', 'done', 1),
        ];

        const movedToBeginning = applyTaskMove(tasks, {
            taskId: 'moving',
            targetColumnId: 'done',
            targetIndex: -10,
        });
        const movedToEnd = applyTaskMove(tasks, {
            taskId: 'moving',
            targetColumnId: 'done',
            targetIndex: 10,
        });

        expect(getOrderedTaskIds(movedToBeginning, 'done')).toEqual([
            'moving',
            'done-first',
            'done-second',
        ]);
        expect(getOrderedTaskIds(movedToEnd, 'done')).toEqual([
            'done-first',
            'done-second',
            'moving',
        ]);
    });

    it('returns the original array when the task does not exist', () => {
        const tasks = [createTask('first', 'todo', 0)];

        const result = applyTaskMove(tasks, {
            taskId: 'missing',
            targetColumnId: 'done',
            targetIndex: 0,
        });

        expect(result).toBe(tasks);
    });
});
