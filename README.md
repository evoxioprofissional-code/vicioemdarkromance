# Vício em Dark Romance — Protótipo Visual

Protótipo **somente front-end** de uma plataforma de assinatura de livros de
dark romance em PDF. Sem banco de dados, sem autenticação real, sem gateway de
pagamento e sem back-end — a "navegação" acontece só por links/botões, e todos
os dados (livros, capas, preços, depoimentos) são **fictícios**.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (paleta, fontes e efeito de grain configurados)
- **Google Fonts**: Playfair Display (títulos) + Inter (corpo)
- **lucide-react** para ícones
- Capas de livro geradas 100% via CSS (gradiente + tipografia) — sem imagens externas

## Como rodar

```bash
npm install
npm run dev
```

Depois abra **http://localhost:3000**.

Para gerar a build de produção:

```bash
npm run build && npm run start
```

## Rotas disponíveis

| Rota | Tela |
|------|------|
| `/` | Landing page (venda): hero, catálogo, como funciona, planos, depoimentos, FAQ, CTA |
| `/checkout?plano=mensal\|trimestral\|anual` | Checkout visual (resumo + formulário mock, sem validação) |
| `/plataforma` | Área do assinante: banner + prateleiras por categoria + biblioteca completa |
| `/plataforma/livro/[id]` | Detalhe do livro: capa, sinopse, tags, ações mock, relacionados |
| `/plataforma/conta` | Minha Conta: perfil, plano atual, "continuar lendo" (dados fictícios) |
| `/admin` | Painel admin — dashboard financeira (MRR, receita, churn, gráficos) |
| `/admin/vendas` | Volume de vendas: novos assinantes, faturamento, top livros |
| `/admin/clientes` | Controle de clientes (tabela com busca e filtros de status) |
| `/admin/renovacoes` | Clientes que não renovaram (cancelados/inadimplentes) |
| `/admin/catalogo` | Gestão de catálogo + regra de "novo lançamento" (5 dias) |
| `/admin/catalogo/novo` | Upload de PDF, capa, título, descrição, tags e toggle de lançamento |

## Estrutura

```
app/
  layout.tsx            # fontes + globals
  globals.css           # paleta, variáveis, grain/noise, componentes utilitários
  page.tsx              # landing
  checkout/page.tsx
  plataforma/
    layout.tsx          # casca (sidebar/topbar)
    page.tsx            # dashboard
    livro/[id]/page.tsx
    conta/page.tsx
components/             # Header, Footer, BookCard, BookCover, Planos, FAQ, Shelf, etc.
data/
  livros.ts            # 16 livros fictícios + helpers de categoria
  planos.ts            # 3 planos de assinatura
```

## Onde está o "mock"

Tudo que simula lógica está marcado com comentários no código:
`app/checkout/page.tsx` (pagamento), botões "Ler agora"/"Baixar PDF" no detalhe
do livro, e os dados em `app/plataforma/conta/page.tsx`.

> ⚠️ Conteúdo fictício, para fins de demonstração. Tema adulto (+18).
