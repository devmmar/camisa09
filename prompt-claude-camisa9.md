# Prompt para Claude — Projeto Camisa 9

Você é uma equipe profissional completa composta por:

- Product Designer
- UX/UI Designer
- Desenvolvedor Frontend Senior
- Desenvolvedor Backend Senior
- Especialista em Segurança Web
- Especialista em Banco de Dados Supabase
- Especialista em E-commerce
- Especialista em Performance e SEO

Crie do zero um site moderno de vendas de camisetas de futebol chamado **Camisa 9**.

## Objetivo do projeto

Desenvolver um e-commerce completo, moderno, seguro e muito bem estilizado, voltado para pessoas que gostam de futebol, moda streetwear e camisetas de time.

A marca deve transmitir:

- futebol
- estilo street
- juventude
- confiança
- exclusividade
- visual premium
- cultura de arquibancada
- lifestyle urbano

## Stack obrigatória

Use:

- React
- TypeScript
- Supabase
- CSS moderno ou Tailwind CSS
- Tema claro e escuro
- Componentização profissional
- Código limpo, organizado e seguro

## Importante sobre segurança

Não usar JWT manual implementado pelo próprio sistema.

A autenticação deve ser feita de forma segura usando os recursos próprios do Supabase Auth, com boas práticas de sessão, proteção de rotas, controle de acesso e validação tanto no frontend quanto no backend/Supabase.

Implemente segurança como se houvesse um especialista cuidando disso:

- login e senha
- cadastro de usuários
- recuperação de senha
- proteção de rotas privadas
- validação de permissões
- regras RLS no Supabase
- prevenção contra acesso indevido
- sanitização de dados
- tratamento seguro de erros
- separação entre usuário comum e administrador

## Funcionalidades principais

O site deve conter:

- página inicial moderna
- catálogo de camisetas
- página de detalhes do produto
- busca de produtos
- filtros por time, seleção, liga, tamanho, preço e tipo
- carrinho de compras
- favoritos
- login
- cadastro
- painel do usuário
- histórico de pedidos
- painel administrativo
- cadastro de produtos
- edição de produtos
- exclusão ou desativação de produtos
- controle de estoque
- upload de imagens pelo Supabase Storage
- tema claro e escuro
- layout responsivo
- animações modernas
- seção de lançamentos
- seção de mais vendidos
- seção promocional
- página sobre a marca
- página de contato
- integração com WhatsApp para finalizar pedido
- cálculo visual do total do carrinho
- sistema de cupons simples
- avaliações de produtos
- mini jogos ou interações ligadas ao futebol

## Mini jogos e interações

Inclua ideias e implementação inicial para mini experiências dentro do site, como:

- quiz “Qual camisa combina com você?”
- roleta de desconto
- desafio de montar o look street futebol
- cards interativos de jogadores históricos
- ranking visual de camisas favoritas

Essas funções devem deixar o site mais divertido, moderno e diferente de um e-commerce comum.

## Identidade visual

O design deve ser premium, moderno e street.

Use referências visuais como:

- preto
- branco
- cinza
- verde campo
- dourado
- detalhes neon ou glow moderado
- tipografia forte
- cards modernos
- imagens grandes
- layout estilo editorial
- visual de loja streetwear
- atmosfera de futebol urbano

O site deve parecer profissional e pronto para uma marca real.

## Banco de dados Supabase

Crie a estrutura das tabelas necessárias, incluindo pelo menos:

- users/profile
- products
- product_images
- categories
- teams
- favorites
- cart_items
- orders
- order_items
- reviews
- coupons

Inclua também:

- relacionamentos
- campos principais
- tipos de dados
- regras RLS
- políticas de segurança
- exemplos de inserts iniciais

## Organização do código

Organize o projeto com uma arquitetura limpa, por exemplo:

- components
- pages
- hooks
- services
- contexts
- types
- utils
- layouts
- routes
- styles
- lib/supabase

Use TypeScript corretamente, com tipos bem definidos.

## Forma de resposta

Para economizar tokens, trabalhe com calma e em etapas.

Não gere tudo de uma vez se ficar muito grande.

Primeiro entregue:

1. visão geral do projeto
2. estrutura de pastas
3. modelagem do banco Supabase
4. configuração inicial do projeto
5. autenticação segura
6. layout base
7. páginas principais
8. componentes principais
9. painel administrativo
10. funcionalidades extras e mini jogos

Ao finalizar cada etapa, pare e diga claramente qual é o próximo passo.

Evite explicações longas demais.

Priorize código funcional, limpo e bem organizado.

Sempre que gerar código, informe exatamente:

- caminho do arquivo
- nome do arquivo
- conteúdo completo
- o que aquele arquivo faz

## Regras importantes

- Não use código inseguro.
- Não use JWT manual.
- Não misture responsabilidades.
- Não gere arquivos desnecessários.
- Não use bibliotecas demais sem necessidade.
- Não escreva textos enormes quando puder ser objetivo.
- Não pule etapas importantes.
- Não invente integração de pagamento agora.
- A finalização da compra pode ser via WhatsApp.
- O projeto deve ser pensado para crescer no futuro.

## Resultado esperado

Ao final, quero ter um projeto React + TypeScript + Supabase completo, moderno, seguro e visualmente muito bonito para a loja **Camisa 9**, com estilo street futebol, autenticação segura, banco bem estruturado, painel administrativo e funcionalidades diferenciadas.