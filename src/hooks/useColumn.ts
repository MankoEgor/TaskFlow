import { useQuery } from '@tanstack/react-query';

import {getAllColumns} from '../services/column.service'

export function useColumn(id?: string){

    const columnsQuery = useQuery({
        queryKey: ['columns', id],
        queryFn: () => getAllColumns(id),
        enabled: Boolean(id)
    })

    return{ 
        columns: columnsQuery.data ?? [],
        error: columnsQuery.error,
        isLoading: columnsQuery.isPending,
    }

}