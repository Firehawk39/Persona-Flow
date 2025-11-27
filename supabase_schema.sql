-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Handled by Supabase Auth, but we might want a profile table)
-- For now, we'll rely on the auth.users table and link via user_id if needed.
-- But for this MVP, we'll keep it simple.

-- JOURNAL ENTRIES TABLE
create table if not exists journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Optional: Link to auth user if auth is enabled
  content text not null,
  mood text,
  ai_insight text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- HABITS TABLE
create table if not exists habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Optional
  name text not null,
  category text not null,
  streak integer default 0,
  completed_days jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CHAT SESSIONS TABLE (Optional, for storing chat history)
create table if not exists chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Optional
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MESSAGES TABLE (Optional, for storing chat history)
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references chat_sessions(id),
  role text not null, -- 'user' or 'assistant'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Row Level Security)
-- For development, you might want to disable RLS or create a policy that allows all access.
-- PRODUCTION: Enable RLS and create policies.

-- Example: Allow public access (NOT SECURE FOR PRODUCTION)
alter table journal_entries enable row level security;
create policy "Public entries" on journal_entries for all using (true);

alter table habits enable row level security;
create policy "Public habits" on habits for all using (true);

alter table chat_sessions enable row level security;
create policy "Public sessions" on chat_sessions for all using (true);

alter table messages enable row level security;
create policy "Public messages" on messages for all using (true);
