-- TaskFlow initial schema.
-- This migration keeps the database reproducible from the repository:
-- tables, profile trigger, board invites, RLS policies, and avatar storage policies.

create extension if not exists "pgcrypto" with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  unique (board_id, user_id)
);

create table if not exists public.columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  position integer not null default 0
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.columns(id) on delete cascade,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  assignee_id uuid references public.profiles(id) on delete set null,
  position integer not null default 0,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.board_invites (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('member')),
  invited_by uuid not null references public.profiles(id) on delete cascade,
  accepted_at timestamptz,
  created_at timestamptz default now(),
  unique (board_id, email)
);

create unique index if not exists board_invites_board_id_lower_email_unique
  on public.board_invites (board_id, lower(email));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id, name, avatar_url)
select
  id,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  null
from auth.users
on conflict (id) do nothing;

create or replace function public.is_board_member(target_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.board_members
    where board_id = target_board_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_board_owner(target_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.board_members
    where board_id = target_board_id
      and user_id = auth.uid()
      and role = 'owner'
  );
$$;

create or replace function public.is_column_board_member(target_column_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.columns c
    join public.board_members bm on bm.board_id = c.board_id
    where c.id = target_column_id
      and bm.user_id = auth.uid()
  );
$$;

create or replace function public.is_column_board_owner(target_column_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.columns c
    join public.board_members bm on bm.board_id = c.board_id
    where c.id = target_column_id
      and bm.user_id = auth.uid()
      and bm.role = 'owner'
  );
$$;

create or replace function public.is_task_board_member(target_task_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tasks t
    join public.columns c on c.id = t.column_id
    join public.board_members bm on bm.board_id = c.board_id
    where t.id = target_task_id
      and bm.user_id = auth.uid()
  );
$$;

revoke all on function public.is_board_member(uuid) from public;
revoke all on function public.is_board_owner(uuid) from public;
revoke all on function public.is_column_board_member(uuid) from public;
revoke all on function public.is_column_board_owner(uuid) from public;
revoke all on function public.is_task_board_member(uuid) from public;

grant execute on function public.is_board_member(uuid) to authenticated;
grant execute on function public.is_board_owner(uuid) to authenticated;
grant execute on function public.is_column_board_member(uuid) to authenticated;
grant execute on function public.is_column_board_owner(uuid) to authenticated;
grant execute on function public.is_task_board_member(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.board_members enable row level security;
alter table public.columns enable row level security;
alter table public.tasks enable row level security;
alter table public.comments enable row level security;
alter table public.board_invites enable row level security;

drop policy if exists "authenticated users can view profiles" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;

create policy "authenticated users can view profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "users can create their own boards" on public.boards;
drop policy if exists "members can view boards" on public.boards;
drop policy if exists "owners can update boards" on public.boards;
drop policy if exists "owners can delete boards" on public.boards;

create policy "users can create their own boards"
on public.boards
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "members can view boards"
on public.boards
for select
to authenticated
using (public.is_board_member(id));

create policy "owners can update boards"
on public.boards
for update
to authenticated
using (public.is_board_owner(id))
with check (public.is_board_owner(id));

create policy "owners can delete boards"
on public.boards
for delete
to authenticated
using (public.is_board_owner(id));

drop policy if exists "members can view board memberships" on public.board_members;
drop policy if exists "users can add themselves as board owner" on public.board_members;
drop policy if exists "invited users can join boards" on public.board_members;

create policy "members can view board memberships"
on public.board_members
for select
to authenticated
using (public.is_board_member(board_id));

create policy "users can add themselves as board owner"
on public.board_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and exists (
    select 1
    from public.boards b
    where b.id = board_members.board_id
      and b.owner_id = auth.uid()
  )
);

create policy "invited users can join boards"
on public.board_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'member'
  and exists (
    select 1
    from public.board_invites bi
    where bi.board_id = board_members.board_id
      and lower(bi.email) = lower((select auth.jwt() ->> 'email'))
      and bi.accepted_at is null
  )
);

drop policy if exists "members can view columns" on public.columns;
drop policy if exists "owners can create columns" on public.columns;
drop policy if exists "owners can update columns" on public.columns;
drop policy if exists "owners can delete columns" on public.columns;

create policy "members can view columns"
on public.columns
for select
to authenticated
using (public.is_board_member(board_id));

create policy "owners can create columns"
on public.columns
for insert
to authenticated
with check (public.is_board_owner(board_id));

create policy "owners can update columns"
on public.columns
for update
to authenticated
using (public.is_board_owner(board_id))
with check (public.is_board_owner(board_id));

create policy "owners can delete columns"
on public.columns
for delete
to authenticated
using (public.is_board_owner(board_id));

drop policy if exists "members can view tasks" on public.tasks;
drop policy if exists "members can create tasks" on public.tasks;
drop policy if exists "members can update tasks" on public.tasks;
drop policy if exists "members can delete tasks" on public.tasks;

create policy "members can view tasks"
on public.tasks
for select
to authenticated
using (public.is_column_board_member(column_id));

create policy "members can create tasks"
on public.tasks
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.is_column_board_member(column_id)
);

create policy "members can update tasks"
on public.tasks
for update
to authenticated
using (public.is_column_board_member(column_id))
with check (public.is_column_board_member(column_id));

create policy "members can delete tasks"
on public.tasks
for delete
to authenticated
using (public.is_column_board_member(column_id));

drop policy if exists "members can view comments" on public.comments;
drop policy if exists "members can create comments" on public.comments;
drop policy if exists "users can delete own comments" on public.comments;

create policy "members can view comments"
on public.comments
for select
to authenticated
using (public.is_task_board_member(task_id));

create policy "members can create comments"
on public.comments
for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_task_board_member(task_id)
);

create policy "users can delete own comments"
on public.comments
for delete
to authenticated
using (
  user_id = auth.uid()
  and public.is_task_board_member(task_id)
);

drop policy if exists "owners can create board invites" on public.board_invites;
drop policy if exists "owners can view board invites" on public.board_invites;
drop policy if exists "owners can update board invites" on public.board_invites;
drop policy if exists "invited users can view own invites" on public.board_invites;
drop policy if exists "invited users can accept own invites" on public.board_invites;

create policy "owners can create board invites"
on public.board_invites
for insert
to authenticated
with check (
  invited_by = auth.uid()
  and public.is_board_owner(board_id)
);

create policy "owners can view board invites"
on public.board_invites
for select
to authenticated
using (public.is_board_owner(board_id));

create policy "owners can update board invites"
on public.board_invites
for update
to authenticated
using (public.is_board_owner(board_id))
with check (public.is_board_owner(board_id));

create policy "invited users can view own invites"
on public.board_invites
for select
to authenticated
using (lower(email) = lower((select auth.jwt() ->> 'email')));

create policy "invited users can accept own invites"
on public.board_invites
for update
to authenticated
using (
  lower(email) = lower((select auth.jwt() ->> 'email'))
  and accepted_at is null
)
with check (lower(email) = lower((select auth.jwt() ->> 'email')));

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "avatars are publicly viewable" on storage.objects;
drop policy if exists "users can upload own avatar" on storage.objects;
drop policy if exists "users can update own avatar" on storage.objects;
drop policy if exists "users can delete own avatar" on storage.objects;

create policy "avatars are publicly viewable"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

create policy "users can upload own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users can update own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users can delete own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
