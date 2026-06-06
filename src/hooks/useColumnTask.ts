import { useQuery } from "@tanstack/react-query";
import { getAllColumnTasks } from "../services/tasks.service";

export function useColumnTask(id?: string){

    const queryTask = useQuery({
        queryKey: ['tasks', id],
        queryFn: () => getAllColumnTasks(id),
        enabled: Boolean(id)
    })

    return {
        tasks: queryTask.data ?? [], 
        error: queryTask.error,
        isLoading: queryTask.isPending,
    }
}