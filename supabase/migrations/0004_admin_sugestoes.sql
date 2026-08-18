-- ============================================================
--  0004 — View de sugestões para o admin (com nome/e-mail de quem sugeriu)
--  Definer view restrita ao service_role (lê auth.users), como admin_clientes.
-- ============================================================

create or replace view public.admin_sugestoes as
select
  s.id,
  s.titulo,
  s.autora,
  s.comentario,
  s.status,
  s.created_at,
  s.user_id,
  p.nome,
  u.email
from public.book_suggestions s
join public.profiles p on p.id = s.user_id
join auth.users u on u.id = s.user_id;

revoke all on public.admin_sugestoes from anon, authenticated;
grant select on public.admin_sugestoes to service_role;
