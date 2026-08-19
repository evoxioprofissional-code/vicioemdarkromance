-- ============================================================
--  0006 — Telefone/WhatsApp do assinante (para recuperação)
-- ============================================================

alter table public.profiles add column if not exists telefone text;

-- Trigger passa a gravar o telefone informado no cadastro
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    new.email,
    new.raw_user_meta_data->>'telefone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- View do admin passa a expor o telefone
drop view if exists public.admin_clientes;
create view public.admin_clientes with (security_invoker = on) as
select
  p.id, p.nome, p.email, p.telefone, p.origem,
  p.created_at            as entrou_em,
  null::timestamptz       as ultima_atividade,
  coalesce(s.status, 'inactive') as status,
  s.plano, s.price_cents, s.current_period_end, s.canceled_at, s.cancel_reason
from public.profiles p
left join public.subscriptions s on s.user_id = p.id;
grant select on public.admin_clientes to authenticated, service_role;
