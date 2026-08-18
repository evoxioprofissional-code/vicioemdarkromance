-- ============================================================
--  0002 — Planos, origem do cliente e view de clientes (admin)
-- ============================================================

-- ---- PLANOS (config de assinatura no banco) ----
create table if not exists public.plans (
  id          text primary key,
  nome        text not null,
  periodo     text,
  price_cents int  not null,
  beneficios  text[] not null default '{}',
  destaque    boolean default false,
  ativo       boolean default true,
  created_at  timestamptz not null default now()
);

alter table public.plans enable row level security;

drop policy if exists "plans: leitura pública" on public.plans;
create policy "plans: leitura pública" on public.plans
  for select using (true);

drop policy if exists "plans: admin gerencia" on public.plans;
create policy "plans: admin gerencia" on public.plans
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.plans (id, nome, periodo, price_cents, beneficios, destaque, ativo)
values (
  'mensal', 'Acesso Total', '1 mês', 999,
  array[
    'Biblioteca completa liberada na hora',
    'Novos títulos de dark romance todo mês',
    'Leitura na plataforma e download em PDF',
    'Todas as coleções e lançamentos inclusos',
    'Leia em qualquer aparelho, onde quiser',
    'Cancele quando quiser, sem multa'
  ],
  true, true
)
on conflict (id) do update set
  nome = excluded.nome,
  periodo = excluded.periodo,
  price_cents = excluded.price_cents,
  beneficios = excluded.beneficios,
  destaque = excluded.destaque,
  ativo = excluded.ativo;

-- ---- Origem de aquisição do cliente (Instagram, TikTok, etc.) ----
alter table public.profiles add column if not exists origem text;

-- ---- View de clientes para o admin (perfil + e-mail + assinatura) ----
-- View "definer" (roda como o dono, que pode ler auth.users).
-- Acesso restrito ao backend: só o service_role consulta (revogado de
-- anon/authenticated). As páginas admin usam a chave service_role.
create or replace view public.admin_clientes as
select
  p.id,
  p.nome,
  u.email,
  p.origem,
  p.created_at            as entrou_em,
  u.last_sign_in_at       as ultima_atividade,
  coalesce(s.status, 'inactive') as status,
  s.plano,
  s.price_cents,
  s.current_period_end,
  s.canceled_at,
  s.cancel_reason
from public.profiles p
join auth.users u on u.id = p.id
left join public.subscriptions s on s.user_id = p.id;

revoke all on public.admin_clientes from anon, authenticated;
grant select on public.admin_clientes to service_role;
