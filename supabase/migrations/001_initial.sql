-- ============================================================
-- TaskFlow schema
-- Run this in your Supabase SQL editor or via supabase db push
-- ============================================================

-- Lists
create table if not exists public.lists (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  accent_color text not null default '#6366f1',
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  list_id      uuid not null references public.lists(id) on delete cascade,
  title        text not null,
  description  text,
  due_date     date,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);

-- Indexes
create index if not exists tasks_list_id_idx on public.tasks(list_id);
create index if not exists tasks_completed_at_idx on public.tasks(completed_at) where completed_at is not null;
create index if not exists tasks_due_date_idx on public.tasks(due_date) where due_date is not null;

-- Row-Level Security (permissive — no auth required for personal use)
-- To restrict per-user, add a user_id column and update policies accordingly.
alter table public.lists enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "allow all lists"  on public.lists;
drop policy if exists "allow all tasks"  on public.tasks;

create policy "allow all lists" on public.lists for all using (true) with check (true);
create policy "allow all tasks" on public.tasks for all using (true) with check (true);

-- Optional: insert a couple of default lists to get started
-- insert into public.lists (name, accent_color, position)
-- values ('Personal', '#6366f1', 0), ('Work', '#22c55e', 1);
