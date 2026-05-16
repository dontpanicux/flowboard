-- Profiles (mirrors auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now()
);

-- Boards
create table boards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

-- Columns
create table columns (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards(id) on delete cascade not null,
  name text not null,
  position integer not null,
  created_at timestamptz default now()
);

-- Tasks
create table tasks (
  id uuid default gen_random_uuid() primary key,
  column_id uuid references columns(id) on delete cascade not null,
  name text not null,
  description text,
  priority text check (priority in ('low','medium','high')),
  due_date date,
  position integer not null,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table boards enable row level security;
alter table columns enable row level security;
alter table tasks enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own boards" on boards for all using (auth.uid() = user_id);
create policy "board columns" on columns for all using (
  exists (select 1 from boards where boards.id = columns.board_id and boards.user_id = auth.uid())
);
create policy "column tasks" on tasks for all using (
  exists (
    select 1 from columns
    join boards on boards.id = columns.board_id
    where columns.id = tasks.column_id and boards.user_id = auth.uid()
  )
);

-- Auto-create profile on sign up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
