import { useMutation, useQueryClient } from '@tanstack/react-query';

import {createNewTask, deleteTask } from "../services/tasks.service"

export function useTask(boardId?: string){
    const queryClient = useQueryClient()


    const createTaskMutation = useMutation({
        mutationFn: createNewTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['column-tasks', boardId]
            })
        }
    })

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['column-tasks', boardId]
            })
        }
    })

    return {

        createTask: createTaskMutation.mutateAsync,
        isCreated: createTaskMutation.isPending,

        deleteTask: deleteTaskMutation.mutateAsync,
        isDeleted: deleteTaskMutation.isPending

    }
}