import { useQuery } from '@tanstack/react-query'
import { getAllBoardMembers } from '../services/boardMembers.service'

export function useBoardMembers(id?: string) {
    const queryMembers = useQuery({
        queryKey: ['board-members', id],
        queryFn: () => getAllBoardMembers(id!),
        enabled: Boolean(id)
    })

    return {
        members: queryMembers.data ?? [],
        isError: queryMembers.isError,
        error: queryMembers.error,
        isLoading: queryMembers.isLoading,
    }
}