import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getTaskComments,
    createComment,
    deleteComment
} from '../services/comments.service';

export function useComments(taskId: string) {
    const queryClient = useQueryClient();

    const commentsQuery = useQuery({
        queryKey: ['comments', taskId],
        queryFn: () => getTaskComments(taskId),
        enabled: Boolean(taskId)
    })

    const createCommentMutation = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['comments', taskId]
            })
        }
    })

    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['comments', taskId]
            })
        }
    })

    return {
        data: commentsQuery.data ?? [],
        isLoading: commentsQuery.isPending,
        error: commentsQuery.error,


        createComment: createCommentMutation.mutateAsync,
        isCreating: createCommentMutation.isPending,

        deleteComment: deleteCommentMutation.mutateAsync,
        isDeleting: deleteCommentMutation.isPending,
    }
}