# Camisa 9 — Status do Projeto

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (tema dark, cores customizadas)
- Supabase (Auth, Database, Storage)
- React Router v6
- Lucide React (ícones)

---

## Estrutura de Pastas

```
camisa9/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx     # Layout principal (header + footer)
│   │   │   ├── AdminLayout.tsx    # Layout do painel admin (sidebar)
│   │   │   ├── Header.tsx         # Navbar responsiva com carrinho e menu de usuário
│   │   │   └── Footer.tsx         # Rodapé com links e redes sociais
│   │   └── product/
│   │       ├── ProductCard.tsx    # Card de produto com favorito e adicionar ao carrinho
│   │       └── ProductGrid.tsx    # Grid responsivo com skeleton loading
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Auth via Supabase (login, cadastro, logout, reset senha)
│   │   └── CartContext.tsx        # Carrinho sincronizado com Supabase
│   ├── hooks/
│   │   └── useProducts.ts         # Hook para buscar produtos (com filtros)
│   ├── lib/
│   │   └── supabase.ts            # Cliente Supabase configurado
│   ├── pages/
│   │   ├── HomePage.tsx           # Home com hero, lançamentos, banner, mais vendidos
│   │   ├── CatalogPage.tsx        # Catálogo com busca e filtros (preço, tamanho)
│   │   ├── ProductPage.tsx        # Página do produto com galeria e finalização WhatsApp
│   │   ├── CartPage.tsx           # Carrinho com cupom e resumo do pedido
│   │   ├── LoginPage.tsx          # Login com Supabase Auth
│   │   ├── RegisterPage.tsx       # Cadastro com confirmação de e-mail
│   │   ├── ForgotPasswordPage.tsx # Recuperação de senha
│   │   ├── ProfilePage.tsx        # Edição de perfil do usuário
│   │   ├── OrdersPage.tsx         # Histórico de pedidos
│   │   ├── FavoritesPage.tsx      # Produtos favoritados
│   │   ├── AboutPage.tsx          # Página sobre a marca
│   │   ├── ContactPage.tsx        # Contato (WhatsApp, e-mail, Instagram)
│   │   ├── GamesPage.tsx          # Quiz, Roleta de desconto, Cards de lendários
│   │   ├── NotFoundPage.tsx       # Página 404
│   │   └── admin/
│   │       ├── AdminDashboard.tsx # Dashboard com stats (produtos, pedidos, usuários, receita)
│   │       ├── AdminProducts.tsx  # Listagem de produtos com toggle ativo/inativo
│   │       ├── AdminProductForm.tsx # Formulário criar/editar produto + upload de imagem
│   │       ├── AdminOrders.tsx    # Listagem e atualização de status de pedidos
│   │       └── AdminCoupons.tsx   # Criação e gestão de cupons de desconto
│   ├── routes/
│   │   ├── AppRoutes.tsx          # Todas as rotas do app
│   │   └── ProtectedRoute.tsx     # Guards: ProtectedRoute, AdminRoute, PublicOnlyRoute
│   ├── types/
│   │   ├── database.ts            # Tipos TypeScript espelhando o schema do Supabase
│   │   └── index.ts               # Tipos derivados e compostos
│   ├── App.tsx                    # Raiz — detecta se Supabase está configurado
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind + classes globais customizadas
├── supabase-schema.sql            # Schema completo do banco (tabelas, RLS, dados iniciais)
├── .env                           # Credenciais Supabase (não vai para o Git)
├── .env.example                   # Template do .env
├── tailwind.config.js             # Cores e animações customizadas da marca
└── STATUS.md                      # Este arquivo
```

---

## Banco de Dados (Supabase)

| Tabela | Descrição |
|---|---|
| `profiles` | Usuários (sincronizado com auth.users via trigger) |
| `categories` | Categorias dos produtos |
| `teams` | Times e seleções |
| `products` | Produtos com preço, estoque, tamanhos |
| `product_images` | Imagens dos produtos (Storage) |
| `favorites` | Produtos favoritados por usuário |
| `cart_items` | Itens no carrinho por usuário |
| `orders` | Pedidos |
| `order_items` | Itens de cada pedido |
| `reviews` | Avaliações de produtos |
| `coupons` | Cupons de desconto |

RLS ativo em todas as tabelas. Admins têm acesso total via função `is_admin()`.

---

## O que está funcionando

- [x] Autenticação completa (login, cadastro, logout, recuperação de senha)
- [x] Proteção de rotas (usuário e admin)
- [x] Header responsivo com carrinho e menu de usuário
- [x] Carrinho sincronizado com banco
- [x] Cupons de desconto no carrinho
- [x] Finalização de pedido via WhatsApp
- [x] Catálogo com busca e filtros
- [x] Página de produto com seleção de tamanho
- [x] Favoritos
- [x] Histórico de pedidos
- [x] Perfil do usuário
- [x] Painel admin: dashboard, produtos, pedidos, cupons
- [x] Upload de imagem de produto (Supabase Storage)
- [x] Página de jogos (quiz, roleta, cards de lendários)
- [x] Tela de setup quando `.env` não está configurado
- [x] Schema SQL com RLS completo
- [x] Design dark premium com identidade visual da marca

---

## O que falta fazer

### Alta prioridade
- [ ] **Número do WhatsApp real** — trocar `5500000000000` em `ProductPage.tsx`, `CartPage.tsx` e `ContactPage.tsx`
- [ ] **Bucket Storage** — criar o bucket `product-images` no Supabase (Storage → New bucket → Public)
- [ ] **Produtos reais** — cadastrar produtos pelo painel admin (`/admin/produtos/novo`)
- [ ] **Tema claro** — implementar alternância dark/light (estrutura Tailwind já suporta com `darkMode: 'class'`)

### Médio prazo
- [ ] **Avaliações de produtos** — UI para exibir e enviar reviews na página do produto
- [ ] **Filtros avançados no catálogo** — por time, liga, seleção, categoria
- [ ] **Página de busca** — resultados dedicados com URL (`/busca?q=brasil`)
- [ ] **Imagens múltiplas** — galeria com mais de uma imagem por produto no admin
- [ ] **Controle de estoque** — alertas de estoque baixo no admin
- [ ] **Confirmação de pedido** — fluxo de checkout mais completo antes do WhatsApp
- [ ] **E-mail de confirmação** — personalizar template de confirmação no Supabase Auth

### Melhorias futuras
- [ ] **SEO** — meta tags dinâmicas por produto (react-helmet ou Vite SSG)
- [ ] **PWA** — manifest + service worker para instalar no celular
- [ ] **Animações** — Framer Motion nas transições de página e cards
- [ ] **Ranking de favoritos** — lista pública das camisetas mais curtidas
- [ ] **Mini jogo extra** — "Monte o look" com combinações de peças
- [ ] **Integração de pagamento** — Stripe, Mercado Pago ou PagSeguro
- [ ] **Painel admin avançado** — gráficos de vendas, exportar pedidos CSV
- [ ] **Notificações** — avisar usuário quando produto esgotado volta ao estoque
- [ ] **Deploy** — Vercel ou Netlify (adicionar variáveis de ambiente lá também)

---

## Como rodar

```bash
# Instalar dependências
npm install

# Criar o .env com suas credenciais Supabase
cp .env.example .env

# Executar o schema no Supabase SQL Editor
# (conteúdo do arquivo supabase-schema.sql)

# Subir o servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

## Como criar usuário admin

1. Crie uma conta pelo site (`/cadastro`)
2. No Supabase → SQL Editor:
```sql
update profiles set role = 'admin' where email = 'seu@email.com';
```
3. Faça logout e login novamente
