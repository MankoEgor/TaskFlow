import { supabase } from '../lib/supabase';
import type { Profile } from '../types/members.type';

export async function getAllBoardMembers(
  boardId: string
): Promise<Profile[]> {
  const { data: all, error: allError } = await supabase
  .from('board_members')
  .select('id, board_id, user_id, role')
  .eq('board_id', boardId);

console.log('memberships:', all);
console.log('memberships error:', allError);

  const { data, error } = await supabase
    .from('board_members')
    .select(`
      profile:profiles!inner (
        id,
        name,
        avatar_url
      )
    `)
    .eq('board_id', boardId);

  console.log('members data:', data);
  console.log('members error:', error);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).flatMap((item) => item.profile);
}