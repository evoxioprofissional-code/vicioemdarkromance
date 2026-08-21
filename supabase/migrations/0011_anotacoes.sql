-- ============================================================
--  0011 — Anotações de leitura (grifos, marcadores e notas)
--  Uma tabela para os três tipos, por usuário e por livro.
--  Grifos guardam "rects" normalizados (0..1) relativos à página,
--  para redesenhar o destaque em qualquer tela (PC e mobile).
-- ============================================================

create table if not exists public.annotations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  book_id    uuid not null references public.books(id) on delete cascade,
  page       int  not null check (page >= 1),
  tipo       text not null check (tipo in ('grifo', 'marcador', 'nota')),
  cor        text not null default 'amarelo',
  texto      text,            -- trecho grifado (para grifo/nota com seleção)
  nota       text,            -- conteúdo escrito pelo leitor (para nota)
  rects      jsonb,           -- [{x,y,w,h}] normalizados 0..1 (para grifo)
  created_at timestamptz not null default now()
);

create index if not exists idx_annotations_user_book
  on public.annotations (user_id, book_id, page);

alter table public.annotations enable row level security;

drop policy if exists "anotacoes: gerenciar as próprias" on public.annotations;
create policy "anotacoes: gerenciar as próprias" on public.annotations
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
