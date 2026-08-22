# TaskFlow

TaskFlow is a responsive Jira-like task management application built with React, TypeScript, and Supabase. Users can create collaborative Kanban boards, manage tasks with drag and drop, invite teammates, and receive updates without reloading the page.

Repository: [github.com/MankoEgor/TaskFlow](https://github.com/MankoEgor/TaskFlow)

## Implemented scope

### Level 1: MVP

- Email and password registration, sign in, and sign out with Supabase Auth.
- Protected application routes for authenticated users.
- Board creation, listing, opening, and owner-only deletion.
- Three default columns for every new board: `To Do`, `In Progress`, and `Done`.
- Owner-only column creation, renaming, and deletion.
- Task creation, editing, and deletion.
- Drag-and-drop task movement between columns and reordering within a column, with optimistic updates and rollback on failure.
- Loading indicators, non-blocking toast notifications, fatal error states, and responsive desktop/mobile layouts.

### Level 2: Full functionality

- Editable task details: title, description, priority, deadline, and assignee.
- Assignee selection from board members.
- Task comments with author, avatar, timestamp, creation, and author-only deletion.
- Supabase Realtime updates for tasks, columns, and comments.
- Invitations to a board by email.
- `owner` and `member` roles enforced by UI rules and Supabase RLS policies.
- Owner controls for invitations and removing board members.
- User profile with a generated name and avatar upload through Supabase Storage.
- Accessible modal dialogs with focus management, keyboard navigation, Escape handling, and focus restoration.

## Tech stack

- React 19 and TypeScript in strict mode
- Vite 8
- Supabase Auth, Postgres, Realtime, and Storage
- TanStack Query for server-state synchronization
- React Router for routing and protected pages
- React Hook Form for form state and validation
- dnd-kit for Kanban drag and drop
- Sonner for non-blocking operation feedback
- Vitest for unit testing Kanban ordering logic
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
5. `supabase/migrations/20260815_move_task_rpc.sql`
6. `supabase/migrations/20260818_create_board_with_defaults.sql`

The migrations create the database schema, profile trigger, RLS policies, invitation flow, avatar bucket policies, Realtime publications, and transactional PostgreSQL functions.

- `move_task` moves a task and normalizes positions in the source and target columns atomically.
- `create_board_with_defaults` creates a board, its owner membership, and three default columns atomically.

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
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run preview` | Preview the production build locally |

## Access model

| Action | Owner | Member |
| --- | :---: | :---: |
| View board and tasks | Yes | Yes |
| Create, edit, move, and delete tasks | Yes | Yes |
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
  utils/        Error, date, and pure Kanban helpers with unit tests
supabase/
  migrations/   Schema, RLS, Storage, and Realtime SQL
```

The UI calls custom hooks, hooks coordinate TanStack Query, and service modules contain the Supabase requests. Realtime events invalidate the relevant query cache so the server remains the source of truth. Board creation and task movement use transactional RPC functions, while TanStack Query provides optimistic DnD updates and restores the previous cache state when a mutation fails.

## Production build and deployment

Create and inspect a production build locally:

```bash
npm test
npm run lint
npm run build
npm run preview
```

The repository includes `netlify.toml` with the build command, output directory, and SPA redirect. When deploying to Netlify, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the site's environment variables.

## Further improvements

- Add integration tests for authentication, RLS-dependent flows, and Supabase mutations.
- Add route-level code splitting to reduce the initial JavaScript bundle.
- Narrow task Realtime subscriptions to the active board.
- Extend keyboard and touch drag-and-drop support.
- Add optional Level 3 features such as task filters, search, activity history, attachments, and dark mode.
