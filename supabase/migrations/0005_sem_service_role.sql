-- ============================================================
--  0005 — Deixar o app funcionar sem a chave service_role
--  (que veio corrompida no ambiente). Admin/assinante passam a
--  operar pela própria sessão, com RLS.
-- ============================================================

-- 1) E-mail no perfil (para o admin ver e-mail sem tocar em auth.users)
alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email
  from auth.users u where u.id = p.id;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2) Views do admin agora leem profiles.email (RLS aplica para admin)
drop view if exists public.admin_clientes;
create view public.admin_clientes with (security_invoker = on) as
select
  p.id, p.nome, p.email, p.origem,
  p.created_at            as entrou_em,
  null::timestamptz       as ultima_atividade,
  coalesce(s.status, 'inactive') as status,
  s.plano, s.price_cents, s.current_period_end, s.canceled_at, s.cancel_reason
from public.profiles p
left join public.subscriptions s on s.user_id = p.id;
grant select on public.admin_clientes to authenticated, service_role;

drop view if exists public.admin_sugestoes;
create view public.admin_sugestoes with (security_invoker = on) as
select
  s.id, s.titulo, s.autora, s.comentario, s.status, s.created_at, s.user_id,
  p.nome, p.email
from public.book_suggestions s
join public.profiles p on p.id = s.user_id;
grant select on public.admin_sugestoes to authenticated, service_role;

-- 3) Assinante ativo (ou admin) pode LER os PDFs → gerar link assinado pela própria sessão
drop policy if exists "pdfs: assinante lê" on storage.objects;
create policy "pdfs: assinante lê" on storage.objects
  for select using (
    bucket_id = 'pdfs' and (public.is_admin() or public.tem_assinatura_ativa())
  );

-- 4) Usuário pode cancelar a própria assinatura (update)
drop policy if exists "assinatura: cancelar a própria" on public.subscriptions;
create policy "assinatura: cancelar a própria" on public.subscriptions
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
