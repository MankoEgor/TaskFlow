import { useQuery } from "@tanstack/react-query";
import { getAllBoardTask } from "../services/tasks.service";

export function useBoardTask(id?: string){

    const queryTask = useQuery({
        queryKey: ['board-tasks', id],
        queryFn: () => getAllBoardTask(id!),
        enabled: Boolean(id)
    })

    return {
        tasks: queryTask.data ?? [], 
        isError: queryTask.isError,
        error: queryTask.error,
        isLoading: queryTask.isLoading,
    }
}