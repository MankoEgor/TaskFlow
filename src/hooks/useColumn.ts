import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    getAllColumns, 
    createNewColumn,
    deleteColumn
} from '../services/column.service'

export function useColumn(id?: string){

    const queryClient = useQueryClient();

    const columnsQuery = useQuery({
        queryKey: ['columns', id],
        queryFn: () => getAllColumns(id),
        enabled: Boolean(id)
    })

    const createColumnMutation = useMutation({
        mutationFn: createNewColumn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['columns', id]
            })
        }
    })

    const deleteColumnMutation = useMutation({
        mutationFn: deleteColumn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['columns', id]
            })
        }
    })

    return{ 
        columns: columnsQuery.data ?? [],
        error: columnsQuery.error,
        isLoading: columnsQuery.isPending,

        createColumn: createColumnMutation.mutateAsync,
        isCreating: createColumnMutation.isPending,

        deleteColumn: deleteColumnMutation.mutateAsync,
        isDeleted: deleteColumnMutation.isPending
    }

}