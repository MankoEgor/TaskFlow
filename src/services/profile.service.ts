import { supabase } from "../lib/supabase";

type ProfileInfo = {
    id: string;
    name: string;
    url: string ;
}

export async function getProfileInfo(userId?: string): Promise<ProfileInfo>{

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

