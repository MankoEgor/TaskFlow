import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAllColumnTasks } from "../services/tasks.service"

export function useTask(id: string){
    const queryClient = useQueryClient()

    const queryTask = useQuery({
        queryKey: ['tasks', id],
        queryFn: () => getAllColumnTasks(id),
        enabled: Boolean(id)
    })

    return {
        tasks: queryTask.data ?? [],
    }
}