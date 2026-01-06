-- Tickets Table
create table tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users not null,
  subject text not null,
  message text not null,
  status text default 'open', -- 'open', 'closed'
  created_at timestamp with time zone default now()
);

-- RLS
alter table tickets enable row level security;

-- Users can view and create their own tickets
create policy "Users can view own tickets" on tickets for select using (auth.uid() = user_id);
create policy "Users can create tickets" on tickets for insert with check (auth.uid() = user_id);
