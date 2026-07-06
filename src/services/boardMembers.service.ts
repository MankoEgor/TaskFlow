import { supabase } from '../lib/supabase';
import type { Profile } from '../types/members.type';

export async function getAllBoardMembers(
  boardId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('board_members')
    .select(`
      profile:profiles!inner (
        id,
        name,
        avatar_url
      )
    `)
    .eq('board_members.board_id', boardId);

  if (error) {
    throw new Error(error.message);
  }

  console.log(data)

  return (data ?? []).flatMap((item) => item.profile);
}