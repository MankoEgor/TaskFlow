create or replace function public.create_board_with_defaults(
  p_title text
)
returns public.boards
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_title text := pg_catalog.btrim(p_title);
  v_board public.boards%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if v_title is null or v_title = '' then
    raise exception 'Board title is required'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = v_user_id
  ) then
    raise exception 'Profile not found'
      using errcode = 'P0002';
  end if;

  insert into public.boards (title, owner_id)
  values (v_title, v_user_id)
  returning * into v_board;

  insert into public.board_members (board_id, user_id, role)
  values (v_board.id, v_user_id, 'owner');

  insert into public.columns (board_id, title, position)
  values
    (v_board.id, 'To Do', 0),
    (v_board.id, 'In Progress', 1),
    (v_board.id, 'Done', 2);

  return v_board;
end;
$$;

revoke all
on function public.create_board_with_defaults(text)
from public, anon;

grant execute
on function public.create_board_with_defaults(text)
to authenticated;
