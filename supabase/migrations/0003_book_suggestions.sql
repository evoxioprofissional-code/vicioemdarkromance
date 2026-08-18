-- ============================================================
--  0003 — Sugestões de livros (assinante sugere títulos futuros)
-- ============================================================

create table if not exists public.book_suggestions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  titulo     text not null,
  autora     text,
  comentario text,
  status     text not null default 'pendente'
             check (status in ('pendente','avaliando','adicionado','recusado')),
  created_at timestamptz not null default now()
);

create index if not exists idx_suggestions_user on public.book_suggestions (user_id);

alter table public.book_suggestions enable row level security;

-- O assinante insere/vê/apaga as próprias; admin vê todas e muda status.
drop policy if exists "sugestoes: inserir a própria" on public.book_suggestions;
create policy "sugestoes: inserir a própria" on public.book_suggestions
  for insert with check (user_id = auth.uid());

drop policy if exists "sugestoes: ver as próprias" on public.book_suggestions;
create policy "sugestoes: ver as próprias" on public.book_suggestions
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "sugestoes: apagar a própria" on public.book_suggestions;
create policy "sugestoes: apagar a própria" on public.book_suggestions
  for delete using (user_id = auth.uid());

drop policy if exists "sugestoes: admin atualiza" on public.book_suggestions;
create policy "sugestoes: admin atualiza" on public.book_suggestions
  for update using (public.is_admin()) with check (public.is_admin());
