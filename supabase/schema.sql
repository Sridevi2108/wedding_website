create table if not exists public.blessings (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 80),
  message text not null check (char_length(trim(message)) between 1 and 500),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists blessings_status_created_at_idx
  on public.blessings (status, created_at desc);

alter table public.blessings enable row level security;

revoke all on public.blessings from anon, authenticated;
grant all on public.blessings to service_role;
