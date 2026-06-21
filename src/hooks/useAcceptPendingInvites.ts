import { useQueryClient } from "@tanstack/react-query";
import { acceptPendingInvites } from "../services/boardInvites.service";
import { useCallback } from "react";

export function useAcceptPendingInvites(userId?: string){
    const queryClient = useQueryClient();

    const acceptedInvite = useCallback( async () => {

        if(!userId) return null;

        const acceptedBoardId = await acceptPendingInvites();

        await queryClient.invalidateQueries({
            queryKey: ['boards', userId]
        })

        return acceptedBoardId;

    }, [queryClient, userId])  

    return {
        acceptedInvite
    }
}