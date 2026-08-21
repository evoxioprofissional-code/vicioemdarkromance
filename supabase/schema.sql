-- ============================================================
--  VÍCIO EM DARK ROMANCE — Esquema do banco (Supabase / Postgres)
--  Cole tudo isto no SQL Editor do Supabase e clique em "Run".
--  Pode rodar novamente com segurança (idempotente).
-- ============================================================

-- ----------------------------------------------------------------
-- 1) PERFIS  (1:1 com auth.users)
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  nome       text,
  role       text not null default 'assinante'
             check (role in ('assinante', 'admin')),
  created_at timestamptz not null default now()
);

-- Cria o perfil automaticamente quando um usuário se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------
-- 2) FUNÇÕES AUXILIARES DE SEGURANÇA
-- ----------------------------------------------------------------
-- É admin?  (a função "tem_assinatura_ativa" fica após a tabela subscriptions)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------
-- 3) LIVROS
-- ----------------------------------------------------------------
create table if not exists public.books (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  titulo      text not null,
  autora      text not null,
  sinopse     text,
  paginas     int  default 0,
  ano         int,
  nota        numeric(2,1) default 5.0,
  tags        text[] not null default '{}',
  capa_de     text default '#2a0510',
  capa_para   text default '#a11d2e',
  selo        text,
  cover_path  text,              -- caminho no bucket "covers" (imagem opcional)
  pdf_path    text,              -- caminho no bucket "pdfs" (privado)
  destaque    boolean default false,
  novo        boolean default false,
  lancado_em  date,
  created_at  timestamptz not null default now()
);

-- Vitrine "Novos Lançamentos": aparece por 5 dias após o lançamento.
create or replace view public.novos_lancamentos as
  select *
  from public.books
  where lancado_em is not null
    and lancado_em >= (current_date - interval '5 days')
  order by lancado_em desc;

-- ----------------------------------------------------------------
-- 4) ASSINATURAS
-- ----------------------------------------------------------------
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null unique references public.profiles(id) on delete cascade,
  status                 text not null default 'inactive'
                         check (status in ('active','past_due','canceled','inactive')),
  plano                  text default 'mensal',
  price_cents            int  default 999,          -- R$ 9,99
  current_period_end     timestamptz,
  cancel_reason          text,
  canceled_at            timestamptz,
  gateway                text,                        -- 'mercadopago' | 'stripe' | ...
  gateway_customer_id    text,
  gateway_subscription_id text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Tem assinatura ativa? (depende da tabela subscriptions acima)
create or replace function public.tem_assinatura_ativa()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = auth.uid()
      and status = 'active'
      and (current_period_end is null or current_period_end > now())
  );
$$;

-- ----------------------------------------------------------------
-- 5) PAGAMENTOS
-- ----------------------------------------------------------------
create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references public.profiles(id) on delete set null,
  subscription_id   uuid references public.subscriptions(id) on delete set null,
  amount_cents      int not null,
  method            text,                              -- 'card' | 'pix' | 'boleto'
  status            text not null default 'pending'
                    check (status in ('paid','pending','failed','refunded')),
  gateway           text,
  gateway_payment_id text,
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 6) PROGRESSO DE LEITURA
-- ----------------------------------------------------------------
create table if not exists public.reading_progress (
  user_id      uuid references public.profiles(id) on delete cascade,
  book_id      uuid references public.books(id) on delete cascade,
  percent      int default 0 check (percent between 0 and 100),
  current_page int not null default 1 check (current_page >= 1),
  total_pages  int,
  updated_at   timestamptz not null default now(),
  primary key (user_id, book_id)
);

create index if not exists reading_progress_user_updated_idx
  on public.reading_progress (user_id, updated_at desc);

-- ---- ANOTAÇÕES (grifos, marcadores e notas) ----
create table if not exists public.annotations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  book_id    uuid not null references public.books(id) on delete cascade,
  page       int  not null check (page >= 1),
  tipo       text not null check (tipo in ('grifo', 'marcador', 'nota')),
  cor        text not null default 'amarelo',
  texto      text,
  nota       text,
  rects      jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_annotations_user_book
  on public.annotations (user_id, book_id, page);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.books            enable row level security;
alter table public.subscriptions    enable row level security;
alter table public.payments         enable row level security;
alter table public.reading_progress enable row level security;

-- ---- PROFILES ----
drop policy if exists "perfil: ver o próprio" on public.profiles;
create policy "perfil: ver o próprio" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "perfil: atualizar o próprio" on public.profiles;
create policy "perfil: atualizar o próprio" on public.profiles
  for update using (id = auth.uid());

-- ---- BOOKS ----  (metadados do catálogo são públicos; o PDF é protegido no storage)
drop policy if exists "livros: leitura pública" on public.books;
create policy "livros: leitura pública" on public.books
  for select using (true);

drop policy if exists "livros: admin gerencia" on public.books;
create policy "livros: admin gerencia" on public.books
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- SUBSCRIPTIONS ----
drop policy if exists "assinatura: ver a própria" on public.subscriptions;
create policy "assinatura: ver a própria" on public.subscriptions
  for select using (user_id = auth.uid() or public.is_admin());
-- Escrita: feita pelo servidor (service_role, que ignora RLS) via webhooks.

-- ---- PAYMENTS ----
drop policy if exists "pagamentos: ver os próprios" on public.payments;
create policy "pagamentos: ver os próprios" on public.payments
  for select using (user_id = auth.uid() or public.is_admin());

-- ---- READING PROGRESS ----
drop policy if exists "progresso: gerenciar o próprio" on public.reading_progress;
create policy "progresso: gerenciar o próprio" on public.reading_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- ANNOTATIONS ----
alter table public.annotations enable row level security;
drop policy if exists "anotacoes: gerenciar as próprias" on public.annotations;
create policy "anotacoes: gerenciar as próprias" on public.annotations
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
--  STORAGE  (buckets de arquivos)
-- ============================================================
-- Capas: público (qualquer um pode ver a imagem)
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- PDFs: privado (download só via link assinado gerado no servidor)
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

-- Somente admin envia/gerencia capas; leitura é pública pelo bucket público.
drop policy if exists "covers: admin escreve" on storage.objects;
create policy "covers: admin escreve" on storage.objects
  for all using (bucket_id = 'covers' and public.is_admin())
  with check (bucket_id = 'covers' and public.is_admin());

-- Somente admin envia PDFs. (Download é feito pelo servidor com service_role.)
drop policy if exists "pdfs: admin escreve" on storage.objects;
create policy "pdfs: admin escreve" on storage.objects
  for all using (bucket_id = 'pdfs' and public.is_admin())
  with check (bucket_id = 'pdfs' and public.is_admin());

-- ============================================================
--  FIM DO ESQUEMA
--  Depois de rodar: cadastre-se no site e rode uma vez, trocando o e-mail:
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'SEU_EMAIL');
-- ============================================================
