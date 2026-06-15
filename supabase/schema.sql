-- KeepSpark Supabase schema
-- Run in the Supabase SQL editor or via `supabase db push`.

-- Notes synced per user (JSON payload matches app Note type).
create table if not exists public.sync_notes (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Named lists synced per user.
create table if not exists public.sync_lists (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- UI preferences (theme, layout, sort, shortcuts).
create table if not exists public.sync_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sync_notes enable row level security;
alter table public.sync_lists enable row level security;
alter table public.sync_settings enable row level security;

create policy sync_notes_select on public.sync_notes
  for select using (auth.uid() = user_id);

create policy sync_notes_insert on public.sync_notes
  for insert with check (auth.uid() = user_id);

create policy sync_notes_update on public.sync_notes
  for update using (auth.uid() = user_id);

create policy sync_notes_delete on public.sync_notes
  for delete using (auth.uid() = user_id);

create policy sync_lists_select on public.sync_lists
  for select using (auth.uid() = user_id);

create policy sync_lists_insert on public.sync_lists
  for insert with check (auth.uid() = user_id);

create policy sync_lists_update on public.sync_lists
  for update using (auth.uid() = user_id);

create policy sync_lists_delete on public.sync_lists
  for delete using (auth.uid() = user_id);

create policy sync_settings_select on public.sync_settings
  for select using (auth.uid() = user_id);

create policy sync_settings_insert on public.sync_settings
  for insert with check (auth.uid() = user_id);

create policy sync_settings_update on public.sync_settings
  for update using (auth.uid() = user_id);

create policy sync_settings_delete on public.sync_settings
  for delete using (auth.uid() = user_id);

create index if not exists sync_notes_user_updated_idx
  on public.sync_notes (user_id, updated_at desc);

create index if not exists sync_lists_user_updated_idx
  on public.sync_lists (user_id, updated_at desc);
