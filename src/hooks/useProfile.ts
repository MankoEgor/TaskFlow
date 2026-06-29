import { useQuery } from "@tanstack/react-query";

import { getProfileInfo } from "../services/profile.service";
export function useProfile(id?: string){
    const profileInfoQuery = useQuery({
        queryKey: ['profiles', id],
        queryFn: () => getProfileInfo(id),
        enabled: Boolean(id)
    })

    return {
        profileInfo: profileInfoQuery.data ?? null,
        error: profileInfoQuery.error,
        loading: profileInfoQuery.isPending
    }
}