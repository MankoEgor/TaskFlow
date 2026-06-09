import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    getAllColumns, 
    createNewColumn,
    deleteColumn,
    updateColumnTitle
} from '../services/column.service'

import type { Column } from '../types/column.type';

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

    const updateColumnMutation = useMutation({
        mutationFn: ({
            columnId,
            title,
        }: {
            columnId: string;
            title: string;
        }) => updateColumnTitle(columnId, title),

        onMutate: async ({ columnId, title }) => {
            await queryClient.cancelQueries({
                queryKey: ['columns', id],
            });

            const previousColumns = queryClient.getQueryData<Column[]>([
                'columns',
                id,
            ]);

            queryClient.setQueryData<Column[]>(
                ['columns', id],
                (oldColumns = []) =>
                    oldColumns.map((column) =>
                        column.id === columnId
                            ? { ...column, title }
                            : column
                    )
            );

            return { previousColumns };
        },

        onError: (_error, _variables, context) => {
            if (context?.previousColumns) {
                queryClient.setQueryData(
                    ['columns', id],
                    context.previousColumns
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
            queryKey: ['columns', id],
            });
        },
    });

    return{ 
        columns: columnsQuery.data ?? [],
        error: columnsQuery.error,
        isLoading: columnsQuery.isPending,

        createColumn: createColumnMutation.mutateAsync,
        isCreating: createColumnMutation.isPending,

        deleteColumn: deleteColumnMutation.mutateAsync,
        isDeleted: deleteColumnMutation.isPending,

        updateColumnTitle: updateColumnMutation.mutateAsync,
        isUpdated: updateColumnMutation.isPending

    }

}