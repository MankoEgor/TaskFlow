import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createNewTask, 
    deleteTask, 
    moveTask,
    updateTask
} from "../services/tasks.service"
import type { Task } from '../types/tasks.type';
import type { MoveTaskInput } from '../types/kanban.type';
import { applyTaskMove } from '../utils/kanban';

type MoveTaskContext = {
    previousTasks?: Task[];
};

export function useTask(boardId?: string){
    const queryClient = useQueryClient()


    const createTaskMutation = useMutation({
        mutationFn: createNewTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['board-tasks', boardId]
            })
        }
    })

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['board-tasks', boardId]
            })
        }
    })


    const moveTaskMutation = useMutation({
        mutationFn: moveTask,
        onMutate: async (input: MoveTaskInput): Promise<MoveTaskContext> => {
            const queryKey = ['board-tasks', boardId];

            await queryClient.cancelQueries({ queryKey });

            const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

            if (previousTasks) {
                queryClient.setQueryData(
                    queryKey,
                    applyTaskMove(previousTasks, input),
                );
            }

            return { previousTasks };
        },
        onError: (_error, _input, context: MoveTaskContext | undefined) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(
                    ['board-tasks', boardId],
                    context.previousTasks,
                );
            }
        },
        onSettled: () =>
            queryClient.invalidateQueries({
                queryKey: ['board-tasks', boardId],
            }),
    });

    const updateTaskMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: () => 
            queryClient.invalidateQueries({
                queryKey: ['board-tasks', boardId]
            })
    })

    return {

        createTask: createTaskMutation.mutateAsync,
        isCreated: createTaskMutation.isPending,

        deleteTask: deleteTaskMutation.mutateAsync,
        isDeleted: deleteTaskMutation.isPending,

        moveTask: moveTaskMutation.mutateAsync,
        isMovingTask: moveTaskMutation.isPending,

        updateTask: updateTaskMutation.mutateAsync,
        isUpdating: updateTaskMutation.isPending,

    }
}
