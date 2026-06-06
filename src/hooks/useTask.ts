import { useMutation, useQueryClient } from '@tanstack/react-query';

import {createNewTask, deleteTask, updateTaskPosition } from "../services/tasks.service"

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
            targetColumnId
        }:{
            taskId: string,
            targetColumnId: string
        }) => updateTaskPosition(taskId, targetColumnId),
        onSuccess:() => {
            queryClient.invalidateQueries({
                queryKey: ['board-tasks', boardId]
            })}
    });

    return {

        createTask: createTaskMutation.mutateAsync,
        isCreated: createTaskMutation.isPending,

        deleteTask: deleteTaskMutation.mutateAsync,
        isDeleted: deleteTaskMutation.isPending,

        moveTask: moveTaskMutation.mutateAsync,
        isMoving: moveTaskMutation.isPending,

    }
}