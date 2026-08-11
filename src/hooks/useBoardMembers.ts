import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    getAllBoardMembers,
    removeBoardMember
} from '../services/boardMembers.service'

export function useBoardMembers(id?: string) {
    const queryClient = useQueryClient();

    const queryMembers = useQuery({
        queryKey: ['board-members', id],
        queryFn: () => getAllBoardMembers(id!),
        enabled: Boolean(id)
    })

    const removeMemberMutation = useMutation({
        mutationFn: (userId: string) => {
            if (!id) {
                throw new Error('Board ID is required');
            }

            return removeBoardMember(id, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['board-members', id]
            });
        }
    })

    return {
        members: queryMembers.data ?? [],
        isError: queryMembers.isError,
        error: queryMembers.error,
        isLoading: queryMembers.isLoading,
        removeMember: removeMemberMutation.mutateAsync,
        isRemoving: removeMemberMutation.isPending,
    }
}
