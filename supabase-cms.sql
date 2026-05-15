-- ── CMS: Configurações do site ──────────────────────────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      text not null default '',
  label      text,
  type       text default 'text', -- text | image | boolean
  section    text default 'geral',
  updated_at timestamptz default now()
);

-- Valores padrão
insert into site_settings (key, value, label, type, section) values
  ('hero_line1',       'Não é só camisa.',       'Linha 1 do Título',     'text',    'hero'),
  ('hero_line2',       'É presença.',             'Linha 2 do Título',     'text',    'hero'),
  ('hero_subtitle',    'Camisas de futebol com estética streetwear. Para quem vive o jogo dentro e fora das quatro linhas.', 'Subtítulo', 'text', 'hero'),
  ('hero_cta1',        'Ver Camisas',             'Botão Principal',       'text',    'hero'),
  ('hero_cta2',        'Chamar no WhatsApp',      'Botão WhatsApp',        'text',    'hero'),
  ('hero_image_url',   '',                        'Imagem do Hero',        'image',   'hero'),
  ('topbar_left',      'Frete grátis para todo o Brasil acima de R$199', 'Barra – Texto Esquerdo', 'text', 'topbar'),
  ('topbar_right',     'Parcele em até 12x sem juros',                   'Barra – Texto Direito',  'text', 'topbar'),
  ('promo_badge',      'Oferta Especial',         'Banner – Badge',        'text',    'promo'),
  ('promo_title',      'Até 40% Off',             'Banner – Título',       'text',    'promo'),
  ('promo_subtitle',   'Nas camisetas selecionadas. Por tempo limitado!', 'Banner – Subtítulo', 'text', 'promo'),
  ('promo_cta',        'Aproveitar Agora',        'Banner – Botão',        'text',    'promo'),
  ('whatsapp_number',  '5521979604258',           'Número do WhatsApp',    'text',    'geral'),
  ('sobre_text',       'A Camisa 9 nasceu da paixão por futebol, cultura e estilo de rua. Mais que camisetas, entregamos identidade. Criamos para quem veste o futebol como presença.', 'Texto Sobre', 'text', 'geral')
on conflict (key) do nothing;

-- RLS: somente admin pode alterar
alter table site_settings enable row level security;
create policy "Leitura pública" on site_settings for select using (true);
create policy "Admin pode alterar" on site_settings for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── CMS: Depoimentos ─────────────────────────────────────────────────────────
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_handle text,
  rating      int default 5 check (rating between 1 and 5),
  body        text not null,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

insert into testimonials (author_name, author_handle, rating, body) values
  ('Gabriel', '@gabrielcariodoso', 5, 'Qualidade absurda, chegou rápido e o atendimento é fora de série!'),
  ('Mariana', '@marisouza', 5, 'Camiseta chegou perfeita, exatamente como na foto. Recomendo demais!'),
  ('Carlos', '@carlosfc', 5, 'Melhor loja de camisetas do Brasil. Já comprei 4 e todas chegaram impecáveis.')
on conflict do nothing;

alter table testimonials enable row level security;
create policy "Leitura pública" on testimonials for select using (true);
create policy "Admin pode alterar" on testimonials for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── CMS: Categorias com imagem ───────────────────────────────────────────────
-- Adiciona coluna image_url na tabela categories se não existir
alter table categories add column if not exists image_url text;
alter table categories add column if not exists sort_order int default 0;
alter table categories add column if not exists is_visible boolean default true;
