-- Optional demo data for reviewers.
-- Register both accounts from README.md before running this script.

do $$
declare
  owner_email constant text := 'alex@taskflow.test';
  member_email constant text := 'maria@taskflow.test';
  owner_user_id uuid;
  member_user_id uuid;
  demo_board_id uuid;
  todo_column_id uuid;
  progress_column_id uuid;
  done_column_id uuid;
  demo_task_id uuid;
begin
  select id
  into owner_user_id
  from auth.users
  where lower(email) = owner_email
  limit 1;

  select id
  into member_user_id
  from auth.users
  where lower(email) = member_email
  limit 1;

  if owner_user_id is null or member_user_id is null then
    raise exception
      'Register % and % before running demo-data.sql',
      owner_email,
      member_email;
  end if;

  insert into public.profiles (id, name, avatar_url)
  values
    (owner_user_id, 'Alex Morgan', null),
    (member_user_id, 'Maria Chen', null)
  on conflict (id) do update
  set name = excluded.name;

  select id
  into demo_board_id
  from public.boards
  where owner_id = owner_user_id
    and title = 'Website Launch'
  order by created_at
  limit 1;

  if demo_board_id is null then
    insert into public.boards (title, owner_id)
    values ('Website Launch', owner_user_id)
    returning id into demo_board_id;
  end if;

  insert into public.board_members (board_id, user_id, role)
  values
    (demo_board_id, owner_user_id, 'owner'),
    (demo_board_id, member_user_id, 'member')
  on conflict (board_id, user_id) do update
  set role = excluded.role;

  select id
  into todo_column_id
  from public.columns
  where board_id = demo_board_id
    and title = 'To Do'
  order by position
  limit 1;

  if todo_column_id is null then
    insert into public.columns (board_id, title, position)
    values (demo_board_id, 'To Do', 0)
    returning id into todo_column_id;
  end if;

  select id
  into progress_column_id
  from public.columns
  where board_id = demo_board_id
    and title = 'In Progress'
  order by position
  limit 1;

  if progress_column_id is null then
    insert into public.columns (board_id, title, position)
    values (demo_board_id, 'In Progress', 1)
    returning id into progress_column_id;
  end if;

  select id
  into done_column_id
  from public.columns
  where board_id = demo_board_id
    and title = 'Done'
  order by position
  limit 1;

  if done_column_id is null then
    insert into public.columns (board_id, title, position)
    values (demo_board_id, 'Done', 2)
    returning id into done_column_id;
  end if;

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    todo_column_id,
    'Review responsive layouts',
    'Check the boards page, Kanban board, task modal, authentication, and profile on mobile and desktop.',
    'high',
    date '2026-09-02',
    member_user_id,
    0,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Review responsive layouts'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    todo_column_id,
    'Prepare release notes',
    'Summarize the implemented MVP and collaboration features for the final handoff.',
    'medium',
    date '2026-09-04',
    owner_user_id,
    1,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Prepare release notes'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    todo_column_id,
    'Define analytics events',
    'List the product events that should be tracked after the first public release.',
    'low',
    date '2026-09-06',
    null,
    2,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Define analytics events'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    progress_column_id,
    'Configure production deployment',
    'Add production environment variables and verify the SPA redirect configuration.',
    'high',
    date '2026-08-28',
    owner_user_id,
    0,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Configure production deployment'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    progress_column_id,
    'Run acceptance testing',
    'Test owner and member permissions, drag and drop, comments, invitations, and Realtime updates.',
    'high',
    date '2026-09-01',
    member_user_id,
    1,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Run acceptance testing'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    progress_column_id,
    'Review RLS policies',
    'Verify that members only access their boards and owner-only operations remain protected.',
    'medium',
    date '2026-09-03',
    owner_user_id,
    2,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Review RLS policies'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    done_column_id,
    'Define MVP scope',
    'Agree on authentication, boards, columns, tasks, drag and drop, and responsive UI as the MVP.',
    'medium',
    date '2026-08-20',
    owner_user_id,
    0,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Define MVP scope'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    done_column_id,
    'Create Kanban workflow',
    'Create the default columns and validate task movement between workflow stages.',
    'low',
    date '2026-08-22',
    member_user_id,
    1,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Create Kanban workflow'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  insert into public.tasks (
    column_id, title, description, priority, due_date,
    assignee_id, position, created_by
  )
  select
    done_column_id,
    'Set up Supabase schema',
    'Create the database schema, profile trigger, RLS policies, Storage bucket, and Realtime publications.',
    'high',
    date '2026-08-24',
    owner_user_id,
    2,
    owner_user_id
  where not exists (
    select 1 from public.tasks
    where title = 'Set up Supabase schema'
      and column_id in (
        select id from public.columns where board_id = demo_board_id
      )
  );

  select t.id
  into demo_task_id
  from public.tasks t
  join public.columns c on c.id = t.column_id
  where c.board_id = demo_board_id
    and t.title = 'Run acceptance testing'
  limit 1;

  insert into public.comments (task_id, user_id, content)
  select
    demo_task_id,
    owner_user_id,
    'Please verify drag and drop on a mobile viewport as well.'
  where not exists (
    select 1 from public.comments
    where task_id = demo_task_id
      and user_id = owner_user_id
      and content = 'Please verify drag and drop on a mobile viewport as well.'
  );

  insert into public.comments (task_id, user_id, content)
  select
    demo_task_id,
    member_user_id,
    'Desktop and mobile smoke tests are in progress. Realtime comments are working.'
  where not exists (
    select 1 from public.comments
    where task_id = demo_task_id
      and user_id = member_user_id
      and content = 'Desktop and mobile smoke tests are in progress. Realtime comments are working.'
  );

  select t.id
  into demo_task_id
  from public.tasks t
  join public.columns c on c.id = t.column_id
  where c.board_id = demo_board_id
    and t.title = 'Configure production deployment'
  limit 1;

  insert into public.comments (task_id, user_id, content)
  select
    demo_task_id,
    member_user_id,
    'The Netlify configuration is ready. The production environment still needs the Supabase variables.'
  where not exists (
    select 1 from public.comments
    where task_id = demo_task_id
      and user_id = member_user_id
      and content = 'The Netlify configuration is ready. The production environment still needs the Supabase variables.'
  );
end;
$$;
