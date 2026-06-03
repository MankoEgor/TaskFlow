import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { 
    getAllColumnTasks,
    createNewTask,
    deleteTask } from "../services/tasks.service"

export function useTask(id: string){
    const queryClient = useQueryClient()

    const queryTask = useQuery({
        queryKey: ['tasks', id],
        queryFn: () => getAllColumnTasks(id),
        enabled: Boolean(id)
    })

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
        tasks: queryTask.data ?? [],
        error: queryTask.error,
        createTask: createTaskMutation.mutateAsync,
        isCreated: createTaskMutation.isPending,
        deleteTask: deleteTaskMutation.mutateAsync
    }
}