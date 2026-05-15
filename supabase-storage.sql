-- ── Storage: Bucket product-images ──────────────────────────────────────────
-- Execute este arquivo no SQL Editor do Supabase após criar o bucket.
--
-- 1. Crie o bucket em Storage → New bucket
--    Nome: product-images
--    Public bucket: SIM (marque a opção "Public bucket")
--
-- 2. Depois rode as policies abaixo:

-- Leitura pública (necessária mesmo em bucket público para URLs diretas)
create policy "Public read product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Admin pode fazer upload
create policy "Admins upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Admin pode atualizar
create policy "Admins update product images"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Admin pode deletar
create policy "Admins delete product images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- ── Observações ──────────────────────────────────────────────────────────────
-- Se preferir usar a função is_admin() em vez do subselect, crie-a antes:
--
-- create or replace function public.is_admin()
-- returns boolean language sql security definer as $$
--   select exists (
--     select 1 from public.profiles where id = auth.uid() and role = 'admin'
--   );
-- $$;
--
-- E substitua o subselect por: and public.is_admin()
