-- ============================================================
--  0008 — Métricas limpas: admins não são clientes; sem pagamentos órfãos
-- ============================================================

-- 1) A view de clientes ignora contas de admin (o dono não é cliente)
drop view if exists public.admin_clientes;
create view public.admin_clientes with (security_invoker = on) as
select
  p.id, p.nome, p.email, p.telefone, p.origem,
  p.created_at            as entrou_em,
  null::timestamptz       as ultima_atividade,
  coalesce(s.status, 'inactive') as status,
  s.plano, s.price_cents, s.current_period_end, s.canceled_at, s.cancel_reason
from public.profiles p
left join public.subscriptions s on s.user_id = p.id
where p.role <> 'admin';
grant select on public.admin_clientes to authenticated, service_role;

-- 2) Remove pagamentos sem dono (sobra de testes) — inflavam a receita
delete from public.payments where user_id is null;

-- 3) Evita órfãos no futuro: apagar o usuário apaga os pagamentos dele
alter table public.payments drop constraint if exists payments_user_id_fkey;
alter table public.payments
  add constraint payments_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;
