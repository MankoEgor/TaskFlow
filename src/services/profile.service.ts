import { supabase } from "../lib/supabase";

type ProfileInfo = {
    id: string;
    name: string;
    url: string | null;
}

export async function getProfileInfo(userId: string): Promise<ProfileInfo | null>{

    const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if(error){
        throw new Error(error.message);
    }

    console.log("profile info", data)

    return data ?? null;
}

export async function uploadUserAvatar(userId: string, file: File): Promise<string>{

    if(file.type.startsWith('image/')){
        throw new Error('Only image files are allowed')
    }

    const max_size = 2 * 1024 * 1024;

    if(file.size > max_size){
        throw new Error('Image must be smaller than 2MB')
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const {error: uploadError} = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            upsert: true,
            cacheControl: '3600'
        })


    if(uploadError){
        throw new Error(uploadError.message)
    }

    const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    const avatarUrl = data.publicUrl;

    const {error: updateProfileError} = await supabase
        .from('profiles')
        .update({
            avatar_url: avatarUrl
        })
        .eq('id', userId)

    if(updateProfileError){
        throw new Error(updateProfileError.message);
    }
     
    return avatarUrl;
}       

