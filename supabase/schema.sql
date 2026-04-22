-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  category text not null check (category in ('living-room', 'bedroom', 'dining')),
  base_price numeric(10,2) not null,
  images text[] not null default '{}',
  options jsonb not null default '[]',
  featured boolean default false,
  created_at timestamptz default now()
);

-- Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  items jsonb not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','in_progress','out_for_delivery','delivered','cancelled')),
  total_price numeric(10,2) not null,
  shipping_address jsonb not null,
  cancelled_at timestamptz,
  cancelled_by uuid,
  cancelled_by_role text check (cancelled_by_role in ('user','admin')),
  cancellation_reason text,
  previous_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User profiles (synced from auth.users via trigger)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean default false,
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- RLS
alter table products enable row level security;
alter table orders enable row level security;
alter table profiles enable row level security;

-- Products: public read
create policy "products_public_read" on products
  for select using (true);

-- Orders: users see their own; admins see all
create policy "orders_user_read" on orders
  for select using (
    auth.uid() = user_id
    or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "orders_user_insert" on orders
  for insert with check (auth.uid() = user_id);

create policy "orders_admin_update" on orders
  for update using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Profiles: users read/update their own; admins read all
create policy "profiles_self_read" on profiles
  for select using (
    auth.uid() = id
    or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "profiles_self_update" on profiles
  for update using (auth.uid() = id);
