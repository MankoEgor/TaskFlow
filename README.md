# TaskFlow

TaskFlow is a responsive Jira-like task management application built with React, TypeScript, and Supabase. Users can create collaborative Kanban boards, manage tasks with drag and drop, invite teammates, and receive updates without reloading the page.

Repository: [github.com/MankoEgor/TaskFlow](https://github.com/MankoEgor/TaskFlow)

Live demo: [tasksfloows.netlify.app](https://tasksfloows.netlify.app/board)

## Demo accounts

The following accounts are intended for review and contain public test data only:

| Role | Email | Password |
| --- | --- | --- |
| Owner | `alex@taskflow.test` | `TaskFlow2026!` |
| Member | `maria@taskflow.test` | `TaskFlow2026!` |

The owner can manage the board structure, invitations, and members. The member can work with tasks and comments but cannot perform owner-only operations.

To prepare the demo environment:

1. Register both accounts through the application.
2. Open **Supabase Dashboard > SQL Editor**.
3. Run `supabase/demo-data.sql` once.
4. Sign in as either user and open the `Website Launch` board.

The seed is safe to run again. It creates the two memberships, three workflow columns, nine realistic tasks with different priorities and assignees, and sample comments without duplicating existing demo records.

## Implemented scope

### Level 1: MVP

- Email and password registration, sign in, and sign out with Supabase Auth.
- Protected application routes for authenticated users.
- Board creation, listing, opening, and owner-only deletion.
- Three default columns for every new board: `To Do`, `In Progress`, and `Done`.
- Owner-only column creation, renaming, and deletion.
- Task creation and deletion.
- Drag-and-drop task movement between columns and reordering within a column.
- Loading indicators, user-facing error dialogs, and responsive desktop/mobile layouts.

### Level 2: Full functionality

- Task details: title, description, priority, deadline, and assignee.
- Assignee selection from board members.
- Task comments with author, avatar, timestamp, creation, and author-only deletion.
- Supabase Realtime updates for tasks, columns, and comments.
- Invitations to a board by email.
- `owner` and `member` roles enforced by UI rules and Supabase RLS policies.
- Owner controls for invitations and removing board members.
- User profile with a generated name and avatar upload through Supabase Storage.

## Tech stack

- React 19 and TypeScript in strict mode
- Vite 8
- Supabase Auth, Postgres, Realtime, and Storage
- TanStack Query for server-state synchronization
- React Router for routing and protected pages
- React Hook Form for form state and validation
- dnd-kit for Kanban drag and drop
- CSS Modules for component styles

## Local setup

### Requirements

- Node.js `20.19+` or `22.12+`
- npm
- A Supabase project

### 1. Clone and install

```bash
git clone https://github.com/MankoEgor/TaskFlow.git
cd TaskFlow
npm ci
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill in the values from Supabase Dashboard, under **Project Settings > API**:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only the public anonymous key belongs in the frontend. Do not expose a Supabase service-role key.

### 3. Prepare Supabase

Open **Supabase Dashboard > SQL Editor** and execute the migration files in chronological order:

1. `supabase/migrations/20260730_initial_schema.sql`
2. `supabase/migrations/20260810_add_board_member_delete_policy.sql`
3. `supabase/migrations/20260810_enable_comments_realtime.sql`
4. `supabase/migrations/20260812_enable_board_realtime.sql`

The migrations create the database schema, profile trigger, RLS policies, invitation flow, avatar bucket policies, and Realtime publications.

The current registration flow expects an authenticated session immediately after sign-up. In **Authentication > Sign In / Providers > Email**, disable email confirmation for the same behavior as the configured project.

### 4. Start the application

```bash
npm run dev
```

Vite prints the local application URL in the terminal, usually `http://localhost:5173`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview the production build locally |

## Access model

| Action | Owner | Member |
| --- | :---: | :---: |
| View board and tasks | Yes | Yes |
| Create, move, and delete tasks | Yes | Yes |
| Add and delete own comments | Yes | Yes |
| Manage columns | Yes | No |
| Invite or remove members | Yes | No |
| Delete board | Yes | No |

Authorization is enforced in Supabase with Row Level Security. Hiding an action in the interface is not treated as the security boundary.

## Project structure

```text
src/
  components/   UI components, board elements, and modal dialogs
  hooks/        TanStack Query hooks and Realtime subscriptions
  layout/       Shared authenticated layout
  lib/          Supabase client configuration
  pages/        Route-level screens
  providers/    Authentication context
  route/        Public and protected route configuration
  services/     Supabase queries and mutations
  types/        Application domain types
  utils/        Error and date helpers
supabase/
  migrations/   Schema, RLS, Storage, and Realtime SQL
```

The UI calls custom hooks, hooks coordinate TanStack Query, and service modules contain the Supabase requests. Realtime events invalidate the relevant query cache so the server remains the source of truth.

## Production build and deployment

Create and inspect a production build locally:

```bash
npm run lint
npm run build
npm run preview
```

The repository includes `netlify.toml` with the build command, output directory, and SPA redirect. When deploying to Netlify, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the site's environment variables.

## Further improvements

- Add automated tests for authentication, RLS-dependent flows, and drag-and-drop ordering.
- Move multi-step board creation and task reordering into transactional Postgres functions.
- Add route-level code splitting to reduce the initial JavaScript bundle.
- Add optional Level 3 features such as task filters, search, activity history, attachments, and dark mode.
