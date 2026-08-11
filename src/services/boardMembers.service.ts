import { supabase } from '../lib/supabase';
import type { BoardMember, BoardRole } from '../types/members.type';

export async function getAllBoardMembers(
  boardId: string
): Promise<BoardMember[]> {
  const { data, error } = await supabase
    .from('board_members')
    .select(`
      role,
      profile:profiles!inner (
        id,
        name,
        avatar_url
      )
    `)
    .eq('board_id', boardId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).flatMap((item) => {
    const profiles = Array.isArray(item.profile) ? item.profile : [item.profile];

    return profiles.map((profile) => ({
      ...profile,
      role: item.role as BoardRole,
    }));
  });
}

export async function removeBoardMember(
  boardId: string,
  userId: string
): Promise<void> {
  const { data, error } = await supabase
    .from('board_members')
    .delete()
    .eq('board_id', boardId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Member not found or you do not have permission to remove them');
  }
}
