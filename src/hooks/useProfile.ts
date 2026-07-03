import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { 
    getProfileInfo,
    uploadUserAvatar
} from "../services/profile.service";


export function useProfile(id?: string){

    const queryClient = useQueryClient()

    const profileInfoQuery = useQuery({
        queryKey: ['profiles', id],
        queryFn: () => getProfileInfo(id!),
        enabled: Boolean(id)
    })

    const uploadAvatarMutation = useMutation({
        mutationFn: (file: File) => {
            if(!id){
                throw new Error('User is not authenticated')
            }

            return uploadUserAvatar(id, file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['profiles', id]
            });
        }
    })

    return {
        profileInfo: profileInfoQuery.data ?? null,
        error: profileInfoQuery.error,
        loading: profileInfoQuery.isPending,

        uploadAvatar: uploadAvatarMutation.mutateAsync,
        isUploaded: uploadAvatarMutation.isPending
    }
}