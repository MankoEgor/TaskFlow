import { supabase } from "../lib/supabase";

export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export async function getProfileInfo(userId: string): Promise<Profile | null>{

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

export async function uploadUserAvatar(
  userId: string,
  file: File
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  const maxSize = 2 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error('Image must be smaller than 2 MB');
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';

  const filePath =
    `${userId}/avatar-${Date.now()}.${fileExtension}`;

  console.log('avatar file:', file);
  console.log('avatar file path:', filePath);

  const {
    data: uploadData,
    error: uploadError,
  } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  console.log('upload data:', uploadData);
  console.log('upload error:', uploadError);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const avatarUrl = publicUrlData.publicUrl;

  console.log('avatar public URL:', avatarUrl);

  const {
    data: updatedProfile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .update({
      avatar_url: avatarUrl,
    })
    .eq('id', userId)
    .select('id, name, avatar_url')
    .single();

  console.log('updated profile:', updatedProfile);
  console.log('profile update error:', profileError);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return avatarUrl;
}

