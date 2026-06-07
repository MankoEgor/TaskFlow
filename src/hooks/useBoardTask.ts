import { useQuery } from "@tanstack/react-query";
import { getAllBoardTask } from "../services/tasks.service";
import type { Task } from "../types/tasks.type";

export function useBoardTask(id?: string){

    const EMPTY_ARRAY: Task[] = [];

    const queryTask = useQuery({
        queryKey: ['board-tasks', id],
        queryFn: () => getAllBoardTask(id!),
        enabled: Boolean(id)
    })

    return {
        tasks: queryTask.data ?? EMPTY_ARRAY, 
        isError: queryTask.isError,
        error: queryTask.error,
        isLoading: queryTask.isLoading,
    }
}