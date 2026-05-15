# Correcoes Prioritarias - Projeto Camisa 9

Use este arquivo como briefing para implementar as correcoes no projeto Camisa 9.

## Contexto

O projeto e uma loja React + TypeScript + Vite usando Supabase para Auth, banco e Storage. Ja existe uma area publica, carrinho, favoritos, checkout via WhatsApp e painel admin.

Antes de alterar, leia a estrutura atual e preserve o estilo visual existente. Nao remova mudancas locais sem necessidade.

## Objetivo

Corrigir os principais problemas encontrados na varredura:

- configuracao Supabase insegura/incorreta;
- fluxo de reset de senha incompleto;
- filtros de catalogo quebrados para categorias;
- checkout via WhatsApp sem registro de pedido;
- painel admin com controle de vendas manuais fora do site;
- cupom sem validacao de pedido minimo;
- tipos do Supabase desatualizados;
- fallback da imagem do hero;
- favoritos sem estado inicial correto;
- policies de Storage ausentes;
- melhorias basicas de performance/documentacao.

## Prioridade 0 - Painel Admin de Vendas Manuais

Objetivo:

Criar uma aba no painel admin para registrar, acompanhar e medir vendas feitas fora do site, por exemplo vendas pelo WhatsApp, Instagram, loja fisica, indicacao ou atendimento manual.

Essa area deve funcionar mesmo quando a venda nao nasceu do carrinho do site.

Arquivos provaveis:

- `src/routes/AppRoutes.tsx`
- `src/components/layout/AdminLayout.tsx`
- criar `src/pages/admin/AdminSales.tsx`
- criar `src/pages/admin/AdminSaleForm.tsx` ou modal interno
- `src/pages/admin/AdminDashboard.tsx`
- `src/types/database.ts`
- `src/types/index.ts`
- `supabase-schema.sql` ou criar `supabase-sales.sql`

### Schema sugerido

Criar uma tabela para vendas manuais. Pode ser separada de `orders` para nao misturar pedido do site com venda cadastrada manualmente.

Nome sugerido: `manual_sales`.

Campos recomendados:

```sql
create table if not exists manual_sales (
  id uuid primary key default uuid_generate_v4(),
  sale_code text unique,

  customer_name text not null,
  customer_phone text,
  customer_email text,
  customer_address text,

  product_type text not null,       -- exemplo: Camiseta, Shorts, Kit, Outro
  product_model text not null,      -- exemplo: Brasil 1998, Flamengo Home, Real Madrid
  product_size text,
  product_quantity integer not null default 1 check (product_quantity > 0),

  unit_price numeric(10,2) not null default 0 check (unit_price >= 0),
  discount numeric(10,2) not null default 0 check (discount >= 0),
  shipping_price numeric(10,2) not null default 0 check (shipping_price >= 0),
  total numeric(10,2) not null default 0 check (total >= 0),

  payment_method text,              -- Pix, Cartao, Dinheiro, Link, Outro
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'partial', 'refunded', 'cancelled')),

  sale_channel text not null default 'manual',
    -- manual, whatsapp, instagram, loja_fisica, indicacao, outro

  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'preparing', 'shipped', 'delivered', 'cancelled')),
  tracking_code text,
  shipped_at timestamptz,
  delivered_at timestamptz,

  notes text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Criar RLS:

```sql
alter table manual_sales enable row level security;

create policy "Admins can manage manual sales"
on manual_sales for all
using (public.is_admin())
with check (public.is_admin());
```

Opcional:

- trigger para gerar `sale_code`, tipo `VND-2026-0001`;
- trigger para atualizar `updated_at`;
- view de metricas agregadas.

### Tela: Admin Vendas

Criar rota:

```tsx
/admin/vendas
```

Adicionar item no menu lateral do admin com icone adequado, por exemplo `Receipt`, `BadgeDollarSign`, `ShoppingBag` ou `CircleDollarSign` do `lucide-react`.

A tela deve ter:

- botao "Nova Venda";
- tabela/lista de vendas;
- busca por cliente, telefone, modelo, codigo da venda;
- filtros por:
  - status de pagamento;
  - status de entrega;
  - canal de venda;
  - periodo;
- cards de resumo no topo:
  - vendas do mes;
  - faturamento do mes;
  - ticket medio;
  - vendas pendentes;
  - vendas a caminho;
  - vendas entregues.

Colunas recomendadas:

- codigo;
- data;
- cliente;
- produto/modelo;
- tamanho;
- quantidade;
- total;
- pagamento;
- entrega;
- canal;
- acoes.

Acoes recomendadas:

- editar venda;
- atualizar status rapidamente;
- marcar como pago;
- marcar como enviado;
- marcar como entregue;
- cancelar venda.

### Formulario: Nova/Editar Venda

O formulario deve permitir preencher manualmente:

- nome do cliente;
- telefone/WhatsApp;
- e-mail, se houver;
- endereco;
- tipo de produto;
- modelo/camisa;
- tamanho;
- quantidade;
- valor unitario;
- desconto;
- frete;
- total calculado automaticamente;
- metodo de pagamento;
- status do pagamento;
- canal de venda;
- situacao da entrega;
- codigo de rastreio;
- observacoes.

Comportamentos:

- total deve ser calculado por:

```txt
(valor unitario * quantidade) - desconto + frete
```

- permitir ajustar manualmente se necessario, mas deixar claro quando foi calculado.
- ao mudar entrega para `shipped`, preencher `shipped_at` se estiver vazio.
- ao mudar entrega para `delivered`, preencher `delivered_at` se estiver vazio.

Critérios de aceite:

- Admin consegue criar venda manual fora do site.
- Admin consegue editar cliente, produto, valores e status.
- Admin consegue filtrar vendas a caminho e entregues.
- Venda manual aparece nas metricas do painel.
- RLS impede usuario comum de ler ou alterar vendas manuais.
- `npm run build` passa.

### Metricas no Dashboard

Atualizar `src/pages/admin/AdminDashboard.tsx`.

Metricas recomendadas:

- receita total do site: soma de `orders.total`;
- receita manual: soma de `manual_sales.total` com `payment_status = 'paid'`;
- receita total geral: site + manual;
- vendas manuais no mes;
- vendas pendentes de pagamento;
- entregas a caminho;
- entregas concluidas;
- top canais de venda;
- top modelos vendidos manualmente.

Importante:

- Diferenciar visualmente "Pedidos do site" e "Vendas manuais".
- Nao contar venda cancelada como receita.
- Idealmente contar receita apenas quando pagamento estiver `paid`.

### Integracao com pedidos existentes

Manter `/admin/pedidos` para pedidos gerados pelo site.

Criar `/admin/vendas` para vendas manuais.

Opcional futuro:

- criar uma tela "Todas as vendas" que una `orders` + `manual_sales`.
- por enquanto, manter separado para reduzir risco.

### Tipos TypeScript

Atualizar:

- `src/types/database.ts`
- `src/types/index.ts`

Adicionar:

```ts
export type ManualSale = Database['public']['Tables']['manual_sales']['Row']
```

Criar unions para:

- `payment_status`;
- `delivery_status`;
- `sale_channel`.

### UX e design

Seguir o visual atual do admin:

- cards escuros;
- bordas discretas;
- acento `#26c4c9`;
- tabelas densas, legiveis e responsivas.

Em mobile, a tabela pode virar cards empilhados.

Evitar uma pagina "landing". A primeira tela deve ser operacional.

## Prioridade 1 - Corrigir configuracao Supabase

Arquivos:

- `.env.example`
- `src/lib/supabase.ts`
- `README.md` ou `STATUS.md`

Tarefas:

1. Trocar valores reais do `.env.example` por placeholders:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

2. Garantir que a URL documentada nao tenha `/rest/v1/`.
3. Opcional, mas recomendado: em `src/lib/supabase.ts`, normalizar URL removendo barra final e alertar em desenvolvimento se a URL contiver `/rest/v1`.

Critérios de aceite:

- `.env.example` nao expoe projeto/chave real.
- README/status orienta usar a URL base do Supabase.
- `npm run build` continua passando.

## Prioridade 2 - Fluxo de reset de senha

Arquivos:

- `src/contexts/AuthContext.tsx`
- `src/routes/AppRoutes.tsx`
- criar `src/pages/ResetPasswordPage.tsx`

Problema atual:

`resetPassword()` redireciona para `/reset-password`, mas essa rota nao existe.

Tarefas:

1. Criar pagina `ResetPasswordPage` com formulario para nova senha e confirmacao.
2. Usar `supabase.auth.updateUser({ password })`.
3. Adicionar rota publica `/reset-password`.
4. Depois de sucesso, redirecionar para `/login` ou `/perfil`.

Critérios de aceite:

- Link de recuperacao abre uma tela funcional.
- Senha pode ser atualizada apos o usuario chegar pelo link do Supabase.
- Erros sao exibidos em portugues.

## Prioridade 3 - Corrigir filtros de categorias no catalogo

Arquivos:

- `src/pages/CatalogPage.tsx`
- `src/hooks/useProducts.ts`
- possivelmente `src/components/layout/Header.tsx`
- possivelmente `src/pages/HomePage.tsx`

Problema atual:

Links como `/catalogo?type=clubes-europeus`, `/catalogo?type=retro`, `/catalogo?type=selecoes` nao filtram corretamente. O catalogo so trata `destaques` e `lancamentos`.

Tarefas:

1. Decidir uma convencao unica:
   - preferencial: usar `category=<slug>` para categorias;
   - manter `type=lancamentos`, `type=destaques`, `type=promocoes` para filtros especiais.
2. Ao receber uma categoria por slug, buscar o `category_id` correspondente ou filtrar via relacionamento.
3. Atualizar links da Home/Header/Footer para a convencao escolhida.
4. Garantir que o titulo da pagina reflita a categoria selecionada.

Critérios de aceite:

- `/catalogo?category=clubes-europeus` mostra apenas produtos da categoria.
- `/catalogo?type=lancamentos` continua funcionando.
- Busca e filtros manuais continuam funcionando juntos.

## Prioridade 4 - Checkout via WhatsApp deve registrar pedido

Arquivos:

- `src/pages/CartPage.tsx`
- `src/contexts/CartContext.tsx`
- `supabase-schema.sql`, se precisar de campos extras

Problema atual:

Ao finalizar, o app apenas abre o WhatsApp. Nao cria `orders`, `order_items`, nao limpa carrinho, nao incrementa uso do cupom e nao aparece em "Meus Pedidos" ou Admin.

Tarefas:

1. Antes de abrir o WhatsApp, criar registro em `orders`.
2. Criar os respectivos `order_items`.
3. Salvar `total`, `discount`, `coupon_code` e `notes`.
4. Incrementar `coupons.used_count` quando houver cupom aplicado.
5. Limpar carrinho apos pedido criado com sucesso.
6. Incluir o numero do pedido na mensagem do WhatsApp.
7. Tratar erro: se falhar no banco, nao limpar carrinho.

Critérios de aceite:

- Pedido aparece em `/pedidos`.
- Pedido aparece no admin `/admin/pedidos`.
- Itens aparecem corretamente no historico.
- Carrinho e limpo apenas apos sucesso.

## Prioridade 5 - Validar pedido minimo do cupom

Arquivos:

- `src/contexts/CartContext.tsx`
- `src/pages/CartPage.tsx`

Tarefas:

1. Em `applyCoupon`, validar `min_order`.
2. Se `total < min_order`, exibir mensagem como:

```txt
Este cupom exige pedido minimo de R$ 199,00.
```

3. Garantir que desconto fixo nao deixe total negativo.

Critérios de aceite:

- Cupom com pedido minimo so aplica quando subtotal atende ao minimo.
- Total final nunca fica abaixo de zero.

## Prioridade 6 - Atualizar tipos do banco

Arquivos:

- `src/types/database.ts`
- `src/types/index.ts`

Problema atual:

O codigo usa tabelas/colunas que nao existem nos tipos:

- `site_settings`
- `testimonials`
- `categories.sort_order`
- `categories.is_visible`

Tarefas:

1. Adicionar `site_settings` e `testimonials` em `Database`.
2. Atualizar `categories.Row`, `Insert` e `Update` com:
   - `image_url`
   - `sort_order`
   - `is_visible`
3. Reduzir casts `as never` quando os tipos passarem a permitir inserts/updates.

Critérios de aceite:

- Build passa.
- Menos casts artificiais nos arquivos admin.
- Tipos representam o schema real, incluindo `supabase-cms.sql`.

## Prioridade 7 - Corrigir fallback da imagem do hero

Arquivo:

- `src/pages/HomePage.tsx`

Problema atual:

`settings.hero_image_url ?? heroImg` nao usa o fallback quando `hero_image_url` e string vazia.

Tarefa:

Trocar para:

```tsx
src={settings.hero_image_url || heroImg}
```

Critérios de aceite:

- Hero exibe imagem local quando CMS nao tiver URL configurada.

## Prioridade 8 - Favoritos no card

Arquivo:

- `src/components/product/ProductCard.tsx`

Problemas atuais:

- `favorited` sempre inicia como `false`.
- O card nao busca se o produto ja esta favoritado.
- Add to cart no card pode falhar quando usuario nao esta logado.

Tarefas:

1. Ao montar o card com usuario logado, consultar `favorites` para aquele produto.
2. Atualizar estado inicial de `favorited`.
3. Se usuario nao estiver logado e clicar em favorito/adicionar ao carrinho, redirecionar para `/login` ou exibir feedback claro.
4. Em caso de erro ao favoritar/desfavoritar, desfazer estado otimista.

Critérios de aceite:

- Produto ja favoritado aparece com coracao ativo.
- Favoritar/desfavoritar persiste no Supabase.
- Usuario deslogado nao recebe erro silencioso.

## Prioridade 9 - Storage policies

Arquivo:

- `supabase-schema.sql` ou criar `supabase-storage.sql`

Problema atual:

O SQL menciona criar bucket `product-images`, mas nao define policies para upload/update/delete em `storage.objects`.

Tarefas:

1. Criar instrucoes SQL para:
   - leitura publica de arquivos do bucket `product-images`;
   - insert/update/delete apenas para admin.
2. Documentar que o bucket precisa ser publico ou que as URLs devem ser assinadas.

Exemplo de direcao:

```sql
-- Ajustar conforme o projeto Supabase
create policy "Public read product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Admins upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins update product images"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_admin());

create policy "Admins delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_admin());
```

Critérios de aceite:

- Admin consegue subir imagens pelo painel.
- Usuarios publicos conseguem visualizar imagens.

## Prioridade 10 - Performance e manutencao

Arquivos:

- `src/assets/camisa9_claro.png`
- `src/assets/camisa9_escuro.png`
- `src/routes/AppRoutes.tsx`
- `package.json`

Tarefas:

1. Otimizar logos grandes. Hoje o build mostra imagens de aproximadamente 3.2 MB e 4.5 MB.
2. Considerar converter para WebP ou reduzir dimensoes.
3. Adicionar script de lint, se for instalar dependencias:

```json
"lint": "eslint src --ext .ts,.tsx"
```

4. Considerar `React.lazy` para rotas admin se o bundle principal continuar grande.

Critérios de aceite:

- Build continua passando.
- Assets principais ficam significativamente menores.
- Se lint for configurado, `npm run lint` executa sem depender de `npx` baixar pacotes na hora.

## Checks finais obrigatorios

Depois das correcoes, rodar:

```bash
npm run build
```

Se configurar lint:

```bash
npm run lint
```

Testar manualmente:

- abrir home;
- abrir catalogo por categoria;
- buscar produto;
- favoritar produto;
- adicionar ao carrinho;
- aplicar cupom com e sem minimo;
- finalizar pedido pelo WhatsApp;
- confirmar pedido em `/pedidos`;
- confirmar pedido em `/admin/pedidos`;
- resetar senha pelo fluxo Supabase;
- editar conteudo no admin CMS;
- subir imagem de produto/hero.

## Observacoes importantes

- Nao commitar `.env`.
- Nao colocar chaves reais no `.env.example`.
- Preservar identidade visual atual.
- Evitar refatoracoes grandes sem necessidade.
- Se alterar schema SQL, manter compatibilidade com o que ja existe usando `if not exists` quando fizer sentido.
