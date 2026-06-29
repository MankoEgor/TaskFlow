import { supabase } from "../lib/supabase";


export type BoardInviteType = {
    id: string;
    board_id: string;
    role: 'member';
}


export async function createBoardInvite(
  boardId: string,
  email: string,
  invitedBy: string
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase(); 

  if (!normalizedEmail) {
    throw new Error('Email is required');
  }

  const { data, error } = await supabase
    .from('board_invites')
    .upsert(
      {
        board_id: boardId,
        email: normalizedEmail,
        role: 'member',
        invited_by: invitedBy,
      },
      {
        onConflict: 'board_id,email',
      }
    )
    .select();

  console.log('created invite data:', data);
  console.log('created invite error:', error);

  if (error) {
    throw new Error(error.message);
  }
}


export async function acceptPendingInvites(): Promise<string | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();  

  if (userError || !user || !user.email) {
    throw new Error('User is not authenticated');
  }

  const normalizedEmail = user.email.trim().toLowerCase();

  const { data: invites, error: invitesError } = await supabase
    .from('board_invites')
    .select('id, board_id, role, email, accepted_at')
    .eq('email', normalizedEmail)
    .is('accepted_at', null);

  if (invitesError) {
    throw new Error(invitesError.message);
  }

  if (!invites || invites.length === 0) {
    console.log('no pending invites found');
    return null;
  }

  const memberships = invites.map((invite) => ({
    board_id: invite.board_id,
    user_id: user.id,
    role: invite.role,
  }));

  const { data: insertedMembers, error: memberError } = await supabase
    .from('board_members')
    .upsert(memberships, {
      onConflict: 'board_id,user_id',
      ignoreDuplicates: true,
    })
    .select();

  if (memberError) {
    throw new Error(memberError.message);
  }

  const inviteIds = invites.map((invite) => invite.id);

  const { data: updatedInvites, error: updateError } = await supabase
    .from('board_invites')
    .update({
      accepted_at: new Date().toISOString(),
    })
    .in('id', inviteIds)
    .select();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return invites[0].board_id;
}