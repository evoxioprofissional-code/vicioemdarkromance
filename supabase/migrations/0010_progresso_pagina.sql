-- ============================================================
--  0010 — Progresso de leitura por PÁGINA
--  Guarda a página onde o leitor parou (para o leitor no site
--  retomar de onde parou) e o total de páginas do PDF real.
--  Mantemos "percent" para compatibilidade (calculado a partir
--  de current_page / total_pages).
-- ============================================================

alter table public.reading_progress
  add column if not exists current_page int not null default 1
    check (current_page >= 1);

alter table public.reading_progress
  add column if not exists total_pages int;

-- Índice para listar "continuar lendo / lidos recentemente" por usuário.
create index if not exists reading_progress_user_updated_idx
  on public.reading_progress (user_id, updated_at desc);
