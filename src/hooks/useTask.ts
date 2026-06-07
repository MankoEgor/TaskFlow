import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createNewTask, 
    deleteTask, 
    updateTaskPosition,
    updateTaskPositionInSameColumn
} from "../services/tasks.service"

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
        mutationFn: ({
            taskId, 
            targetColumnId,
            targetPosition
        }:{
            taskId: string,
            targetColumnId: string,
            targetPosition: number
        }) => updateTaskPosition(taskId, targetColumnId, targetPosition),
        onSuccess:() => {
            queryClient.invalidateQueries({
                queryKey: ['board-tasks', boardId]
            })}

    });

    const reorderTasksMutation = useMutation({
        mutationFn: updateTaskPositionInSameColumn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['board-task', boardId]
            })
        }
    }) 

    return {

        createTask: createTaskMutation.mutateAsync,
        isCreated: createTaskMutation.isPending,

        deleteTask: deleteTaskMutation.mutateAsync,
        isDeleted: deleteTaskMutation.isPending,

        moveTask: moveTaskMutation.mutateAsync,
        isMoving: moveTaskMutation.isPending,

        reorderTasks: reorderTasksMutation.mutateAsync,
        isReordering: reorderTasksMutation.isPending

    }
}