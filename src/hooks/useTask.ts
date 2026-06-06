import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNewTask, deleteTask } from "../services/tasks.service"

export function useTask(id?: string){
    const queryClient = useQueryClient()


    const createTaskMutation = useMutation({
        mutationFn: createNewTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tasks', id]
            })
        }
    })

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tasks', id]
            })
        }
    })

    return {
        createTask: createTaskMutation.mutateAsync,
        isCreated: createTaskMutation.isPending,
        deleteTask: deleteTaskMutation.mutateAsync
    }
}