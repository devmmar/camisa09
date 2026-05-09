-- =============================================
-- CAMISA 9 — Supabase Schema + RLS
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---- PROFILES ----
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---- CATEGORIES ----
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamptz default now()
);

-- ---- TEAMS ----
create table teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  country text,
  league text,
  logo_url text,
  created_at timestamptz default now()
);

-- ---- PRODUCTS ----
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) check (original_price >= 0),
  category_id uuid references categories(id) on delete set null,
  team_id uuid references teams(id) on delete set null,
  sizes text[] default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- PRODUCT IMAGES ----
create table product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  alt text,
  is_primary boolean default false,
  position integer default 0,
  created_at timestamptz default now()
);

-- ---- FAVORITES ----
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ---- CART ITEMS ----
create table cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  size text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique(user_id, product_id, size)
);

-- ---- COUPONS ----
create table coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  min_order numeric(10,2),
  max_uses integer,
  used_count integer not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ---- ORDERS ----
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete restrict not null,
  status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  total numeric(10,2) not null check (total >= 0),
  discount numeric(10,2) not null default 0,
  coupon_code text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- ORDER ITEMS ----
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz default now()
);

-- ---- REVIEWS ----
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table profiles enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table categories enable row level security;
alter table teams enable row level security;
alter table favorites enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table coupons enable row level security;

-- Helper: is admin
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer;

-- PROFILES
create policy "Users can view own profile" on profiles for select using (id = auth.uid());
create policy "Users can update own profile" on profiles for update using (id = auth.uid());
create policy "Admins can view all profiles" on profiles for select using (is_admin());

-- PRODUCTS (public read, admin write)
create policy "Anyone can view active products" on products for select using (is_active = true);
create policy "Admins can manage products" on products for all using (is_admin());

-- PRODUCT IMAGES (public read, admin write)
create policy "Anyone can view product images" on product_images for select using (true);
create policy "Admins can manage product images" on product_images for all using (is_admin());

-- CATEGORIES & TEAMS (public read)
create policy "Anyone can view categories" on categories for select using (true);
create policy "Admins manage categories" on categories for all using (is_admin());
create policy "Anyone can view teams" on teams for select using (true);
create policy "Admins manage teams" on teams for all using (is_admin());

-- FAVORITES
create policy "Users manage own favorites" on favorites for all using (user_id = auth.uid());

-- CART
create policy "Users manage own cart" on cart_items for all using (user_id = auth.uid());

-- ORDERS
create policy "Users can view own orders" on orders for select using (user_id = auth.uid());
create policy "Users can create orders" on orders for insert with check (user_id = auth.uid());
create policy "Admins manage all orders" on orders for all using (is_admin());

-- ORDER ITEMS
create policy "Users can view own order items" on order_items for select
  using (exists (select 1 from orders where id = order_id and user_id = auth.uid()));
create policy "Users can create order items" on order_items for insert
  with check (exists (select 1 from orders where id = order_id and user_id = auth.uid()));
create policy "Admins manage order items" on order_items for all using (is_admin());

-- REVIEWS
create policy "Anyone can view approved reviews" on reviews for select using (is_approved = true);
create policy "Users manage own reviews" on reviews for insert with check (user_id = auth.uid());
create policy "Admins manage reviews" on reviews for all using (is_admin());

-- COUPONS (public read active, admin write)
create policy "Anyone can check active coupons" on coupons for select using (is_active = true);
create policy "Admins manage coupons" on coupons for all using (is_admin());

-- =============================================
-- STORAGE
-- =============================================

-- Bucket: product-images (run in Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- =============================================
-- SAMPLE DATA
-- =============================================

insert into categories (name, slug) values
  ('Seleções', 'selecoes'),
  ('Clubes Nacionais', 'clubes-nacionais'),
  ('Clubes Europeus', 'clubes-europeus'),
  ('Retrô', 'retro'),
  ('Streetwear', 'streetwear');

insert into teams (name, slug, country, league) values
  ('Brasil', 'brasil', 'Brasil', 'CBF'),
  ('Argentina', 'argentina', 'Argentina', 'AFA'),
  ('França', 'franca', 'França', 'FFF'),
  ('Flamengo', 'flamengo', 'Brasil', 'Série A'),
  ('São Paulo', 'sao-paulo', 'Brasil', 'Série A'),
  ('Real Madrid', 'real-madrid', 'Espanha', 'La Liga'),
  ('Barcelona', 'barcelona', 'Espanha', 'La Liga'),
  ('Manchester City', 'manchester-city', 'Inglaterra', 'Premier League');

insert into coupons (code, discount_type, discount_value, is_active) values
  ('CAMISA9', 'percent', 10, true),
  ('ESTREIA', 'fixed', 20, true);
