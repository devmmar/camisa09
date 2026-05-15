-- ── Vendas Manuais ────────────────────────────────────────────────────────────
create table if not exists manual_sales (
  id               uuid primary key default gen_random_uuid(),
  sale_code        text unique,

  customer_name    text not null,
  customer_phone   text,
  customer_email   text,
  customer_address text,

  product_type     text not null default 'Camiseta',
  product_model    text not null,
  product_size     text,
  product_quantity integer not null default 1 check (product_quantity > 0),

  unit_price       numeric(10,2) not null default 0 check (unit_price >= 0),
  discount         numeric(10,2) not null default 0 check (discount >= 0),
  shipping_price   numeric(10,2) not null default 0 check (shipping_price >= 0),
  total            numeric(10,2) not null default 0 check (total >= 0),

  payment_method   text,
  payment_status   text not null default 'pending'
    check (payment_status in ('pending','paid','partial','refunded','cancelled')),

  sale_channel     text not null default 'manual'
    check (sale_channel in ('manual','whatsapp','instagram','loja_fisica','indicacao','outro')),

  delivery_status  text not null default 'pending'
    check (delivery_status in ('pending','preparing','shipped','delivered','cancelled')),
  tracking_code    text,
  shipped_at       timestamptz,
  delivered_at     timestamptz,

  notes            text,
  created_by       uuid references profiles(id) on delete set null,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Trigger: gerar sale_code automaticamente (VND-2026-0001)
create or replace function generate_sale_code()
returns trigger language plpgsql as $$
declare
  year_part text := to_char(now(), 'YYYY');
  seq_num   int;
begin
  select coalesce(max(
    nullif(regexp_replace(sale_code, '^VND-\d{4}-', ''), '')::int
  ), 0) + 1
  into seq_num
  from manual_sales
  where sale_code like 'VND-' || year_part || '-%';

  new.sale_code := 'VND-' || year_part || '-' || lpad(seq_num::text, 4, '0');
  return new;
end;
$$;

create trigger set_sale_code
  before insert on manual_sales
  for each row when (new.sale_code is null)
  execute function generate_sale_code();

-- Trigger: atualizar updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger manual_sales_updated_at
  before update on manual_sales
  for each row execute function update_updated_at();

-- RLS
alter table manual_sales enable row level security;

create policy "Admins can manage manual sales"
on manual_sales for all
using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
)
with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
