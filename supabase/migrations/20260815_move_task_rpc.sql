create or replace function public.move_task(
  p_task_id uuid,
  p_target_column_id uuid,
  p_target_index integer
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_source_column_id uuid;
  v_source_board_id uuid;
  v_target_board_id uuid;
  v_target_count integer;
  v_target_index integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if p_target_index is null or p_target_index < 0 then
    raise exception 'Target index must be non-negative'
      using errcode = '22023';
  end if;

  select c.board_id
  into v_target_board_id
  from public.columns c
  where c.id = p_target_column_id;

  if not found then
    raise exception 'Target column not found'
      using errcode = 'P0002';
  end if;

  if not public.is_board_member(v_target_board_id) then
    raise exception 'You do not have access to this board'
      using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_target_board_id::text, 0)
  );

  select t.column_id, c.board_id
  into v_source_column_id, v_source_board_id
  from public.tasks t
  join public.columns c on c.id = t.column_id
  where t.id = p_task_id;

  if not found then
    raise exception 'Task not found'
      using errcode = 'P0002';
  end if;

  if v_source_board_id <> v_target_board_id then
    raise exception 'Task cannot be moved to another board'
      using errcode = '22023';
  end if;

  perform 1
  from public.tasks t
  where t.column_id in (v_source_column_id, p_target_column_id)
  order by t.id
  for update;

  select count(*)::integer
  into v_target_count
  from public.tasks t
  where t.column_id = p_target_column_id
    and t.id <> p_task_id;

  v_target_index := least(p_target_index, v_target_count);

  if v_source_column_id <> p_target_column_id then
    with ordered_source as (
      select
        t.id,
        (row_number() over (order by t.position, t.id) - 1)::integer
          as new_position
      from public.tasks t
      where t.column_id = v_source_column_id
        and t.id <> p_task_id
    )
    update public.tasks t
    set position = ordered_source.new_position
    from ordered_source
    where t.id = ordered_source.id
      and t.position is distinct from ordered_source.new_position;
  end if;

  with ordered_target as (
    select
      t.id,
      (row_number() over (order by t.position, t.id) - 1)::integer
        as base_position
    from public.tasks t
    where t.column_id = p_target_column_id
      and t.id <> p_task_id
  ),
  positioned_target as (
    select
      id,
      case
        when base_position >= v_target_index then base_position + 1
        else base_position
      end as new_position
    from ordered_target
  )
  update public.tasks t
  set position = positioned_target.new_position
  from positioned_target
  where t.id = positioned_target.id
    and t.position is distinct from positioned_target.new_position;

  update public.tasks
  set
    column_id = p_target_column_id,
    position = v_target_index
  where id = p_task_id
    and (
      column_id is distinct from p_target_column_id
      or position is distinct from v_target_index
    );
end;
$$;

revoke execute
on function public.move_task(uuid, uuid, integer)
from public, anon;

grant execute
on function public.move_task(uuid, uuid, integer)
to authenticated;
