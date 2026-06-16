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
): Promise<void>{
    const normalizedEmail = email.trim().toLocaleLowerCase();

    if(!normalizedEmail){
        throw new Error('Email is requard');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
         throw new Error('Enter a valid email address');
}

    const {error} = await supabase
        .from('board_invites')
        .upsert({
            board_id: boardId,
            email: normalizedEmail,
            role: 'member',
            invited_by: invitedBy,
        }, 
        {
            onConflict: 'board_id,email'
        });

    if(error){
        throw new Error(error.message);
    }
}


export async function acceptPendingInvites(): Promise<string | null>{
    const {data: {user}, error: userError} = await supabase.auth.getUser();

    console.log(user);

    if(userError || !user || !user.email){
        throw new Error('User is not authenticated');
    }

    if(!user.email_confirmed_at){
        throw new Error('Please confirmed your email first');
    }

    const normalizedEmail = user.email.toLocaleLowerCase();

    const {data: invites, error: invitesError} = await supabase
        .from('board_invites')
        .select('id, board_id, role')
        .eq('email', normalizedEmail)
        .is('accepted_at', null);

    if(invitesError){
        throw new Error(invitesError.message);
    }

    if(!invites || invites.length === 0){
        return null;
    }

    const typedInvites = invites as BoardInviteType[];

    const membership = typedInvites.map((invite) => ({
        board_id: invite.board_id,
        user_id: invite.id,
        role: invite.role

    }));

    const {error: membersError} = await supabase
        .from('board_members')
        .upsert(membership, {
            onConflict: 'board_id, user_id'
        })

    if(membersError){
        throw new Error(membersError.message);
    }

    const {error: updateError} = await supabase
        .from('board_invites')
        .update({
            accepted_at: new Date().toISOString
        })
        .in(
            'id',
            typedInvites.map((invite) => invite.id)
        );

        if(updateError){
            throw new Error(updateError.message);
        }

        return typedInvites[0].board_id;
}