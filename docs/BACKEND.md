# Backend — Guia de setup (GitHub + Vercel + Supabase)

Este guia liga o protótipo a um backend real. Enquanto as chaves não são
preenchidas, o site continua rodando no **modo mock** (dados locais).

> Segurança: **você** cria as contas e cola as chaves. O código, o SQL e as
> instruções já estão prontos aqui no repositório.

---

## 1. GitHub (guardar o código)

1. Crie o repositório em github.com → **New repository** → nome `vicioemdark`,
   **Private**, sem README.
2. Conecte e envie (o primeiro commit já existe):

   ```bash
   git remote add origin https://github.com/SEU_USUARIO/vicioemdark.git
   git push -u origin main
   ```

---

## 2. Supabase (banco + login + arquivos)

1. Em supabase.com → **New project**. Região: **South America (São Paulo)**.
   Guarde a senha do banco.
2. **SQL Editor** → cole o conteúdo de [`supabase/schema.sql`](../supabase/schema.sql) → **Run**.
3. **SQL Editor** → cole [`supabase/seed.sql`](../supabase/seed.sql) → **Run**
   (insere os 16 livros).
4. **Project Settings → API** → copie:
   - `Project URL`
   - `anon public`
   - `service_role` (secreta)
5. **Authentication → Providers → Email**: deixe **Email** habilitado.
   (Para testar sem confirmar e-mail, pode desligar "Confirm email"
   temporariamente em Authentication → Providers.)

### Virar admin

Depois de criar sua conta no site (passo 4 abaixo), rode no SQL Editor,
trocando o e-mail:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'SEU_EMAIL');
```

---

## 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável | Onde pegar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (local) / URL da Vercel (produção) |

Rode local para testar: `npm run dev`.

---

## 4. Vercel (publicar)

1. vercel.com → entre **com o GitHub** → **Add New → Project** → importe
   `vicioemdark`. Ele detecta Next.js automaticamente.
2. Em **Environment Variables**, adicione as mesmas 4 variáveis acima
   (use a URL da Vercel em `NEXT_PUBLIC_SITE_URL`).
3. **Deploy**. A cada `git push` na branch `main`, a Vercel publica sozinha.
4. Volte no Supabase → **Authentication → URL Configuration** e adicione a URL
   da Vercel em **Site URL** e **Redirect URLs**.

---

## Estrutura do banco (resumo)

| Tabela | Para quê |
|---|---|
| `profiles` | Usuários + papel (`assinante` / `admin`) |
| `books` | Catálogo (metadados, capa, caminho do PDF) |
| `subscriptions` | Assinatura de cada usuário (status, período, gateway) |
| `payments` | Histórico de cobranças |
| `reading_progress` | Progresso de leitura por livro |
| view `novos_lancamentos` | Livros dos últimos 5 dias (regra da vitrine) |

Segurança (RLS) já configurada: cada assinante só enxerga os próprios dados;
os PDFs ficam num bucket privado e só são liberados por link assinado gerado no
servidor para quem tem assinatura ativa.

---

## Próximas etapas (depois do setup)

1. Telas de **login/cadastro** (`/entrar`, `/cadastrar`) com e-mail e senha.
2. Ligar **plataforma e admin** para lerem/gravarem no Supabase (substituindo o mock).
3. **Upload real** de PDF e capa no painel admin.
4. **Gateway de pagamento** (a definir) + webhook que ativa a assinatura.
