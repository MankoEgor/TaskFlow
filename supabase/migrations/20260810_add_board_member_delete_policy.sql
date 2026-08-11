drop policy if exists "owners can remove board members" on public.board_members;

create policy "owners can remove board members"
on public.board_members
for delete
to authenticated
using (
  role = 'member'
  and public.is_board_owner(board_id)
);
