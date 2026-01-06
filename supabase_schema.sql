-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table users (
  id uuid references auth.users primary key,
  email text unique not null,
  wallet_address text,
  total_invested numeric default 0,
  total_earned numeric default 0,
  last_investment_amount numeric default 0,
  role text default 'user', -- 'user' or 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Investments Table
create table investments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users not null,
  amount numeric not null,
  expected_profit numeric not null, -- calculated at creation
  actual_profit numeric, -- after fee
  status text default 'active', -- 'active', 'completed', 'withdrawn'
  start_time timestamp with time zone default now(),
  end_time timestamp with time zone, -- start_time + 24h
  created_at timestamp with time zone default now()
);

-- Withdrawals Table
create table withdrawals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users not null,
  amount numeric not null,
  wallet_address text not null,
  network text default 'TRC20',
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  admin_note text,
  created_at timestamp with time zone default now()
);

-- Policies (RLS)
alter table users enable row level security;
alter table investments enable row level security;
alter table withdrawals enable row level security;

-- Users can read their own data
create policy "Users can view own data" on users for select using (auth.uid() = id);
create policy "Users can view own investments" on investments for select using (auth.uid() = user_id);
create policy "Users can view own withdrawals" on withdrawals for select using (auth.uid() = user_id);

-- Only system/service role can update balances (or triggered functions)
-- For now, allow insert for testing but ideally restricted
