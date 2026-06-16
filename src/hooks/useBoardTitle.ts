import { useQuery } from "@tanstack/react-query"

import {getBoardTitle} from '../services/boards.service'

export function useBoardTitle(boardId?: string){

    const titleQuery = useQuery({
        queryKey: ['boards-title', boardId],
        queryFn: () => getBoardTitle(boardId!),
        enabled: Boolean(boardId)
    })

    return {
        boardTitle: titleQuery.data ?? '',
        titleError: titleQuery.error,
    }
}