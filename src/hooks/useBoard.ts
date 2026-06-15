import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { 
    getMyBoards, 
    createNewBoard, 
    deleteBoard,
    getBoardTitle
} from '../services/boards.service';

export function useBoards(id?: string){
    const queryClient = useQueryClient();

    const boardsQuery = useQuery({
        queryKey: ['boards', id],
        queryFn: () => getMyBoards(id),
        enabled: Boolean(id)
    })

    const titleQuery = useQuery({
        queryKey: ['boards-title', id],
        queryFn: () => getBoardTitle(id!),
        enabled: Boolean(id)
    })


    const createBoardMutation = useMutation({
        mutationFn: createNewBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['boards', id]
            })
        }
    })     
    
    const deleteBoardMutation = useMutation({
        mutationFn: deleteBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['boards', id]
            })
        }
    })

    return {
        boards: boardsQuery.data ?? [],
        isLoading: boardsQuery.isPending,
        error: boardsQuery.error,

        boardTitle: titleQuery.data ?? '',
        titleError: titleQuery.error,

        createBoard: createBoardMutation.mutateAsync,
        isCreating: createBoardMutation.isPending,

        deleteBoard: deleteBoardMutation.mutateAsync,
        isDeleting: deleteBoardMutation.isPending
    }
    



}