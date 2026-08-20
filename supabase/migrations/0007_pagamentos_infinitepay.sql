-- ============================================================
--  0007 — Pagamentos (InfinitePay / Pix)
--  Pedido pendente + função de confirmação chamada pelo webhook.
--  Sem service_role: a confirmação usa uma função SECURITY DEFINER
--  protegida por um segredo que só o nosso webhook conhece.
-- ============================================================

create table if not exists public.payment_orders (
  order_nsu       text primary key,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  gateway         text not null,
  amount_cents    int  not null,
  status          text not null default 'pending'
                  check (status in ('pending','paid','expired')),
  transaction_nsu text,
  created_at      timestamptz not null default now(),
  paid_at         timestamptz
);

alter table public.payment_orders enable row level security;

drop policy if exists "orders: inserir o próprio" on public.payment_orders;
create policy "orders: inserir o próprio" on public.payment_orders
  for insert with check (user_id = auth.uid());

drop policy if exists "orders: ver os próprios" on public.payment_orders;
create policy "orders: ver os próprios" on public.payment_orders
  for select using (user_id = auth.uid() or public.is_admin());

-- Confirmação de pagamento (chamada pelo webhook, via anon key + segredo).
create or replace function public.confirmar_pagamento(
  p_secret          text,
  p_order_nsu       text,
  p_transaction_nsu text,
  p_amount_cents    int
) returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_user   uuid;
  v_amount int;
begin
  if p_secret <> 'vdr_whk_7b87bcb2a323a8d530d6058978b88815e8023b01575aa9e6' then
    return 'unauthorized';
  end if;

  select user_id, amount_cents into v_user, v_amount
    from public.payment_orders where order_nsu = p_order_nsu;
  if v_user is null then
    return 'order_not_found';
  end if;

  -- Idempotência: só processa se ainda estava pendente.
  update public.payment_orders
    set status = 'paid', transaction_nsu = p_transaction_nsu, paid_at = now()
    where order_nsu = p_order_nsu and status = 'pending';
  if not found then
    return 'already_processed';
  end if;

  -- Ativa a assinatura por 30 dias.
  insert into public.subscriptions
    (user_id, status, plano, price_cents, current_period_end, gateway, updated_at)
  values
    (v_user, 'active', 'mensal', coalesce(v_amount, 999),
     now() + interval '30 days', 'infinitepay', now())
  on conflict (user_id) do update set
    status = 'active',
    current_period_end = now() + interval '30 days',
    gateway = 'infinitepay',
    canceled_at = null,
    updated_at = now();

  -- Registra o pagamento.
  insert into public.payments
    (user_id, amount_cents, method, status, gateway, gateway_payment_id, paid_at)
  values
    (v_user, coalesce(v_amount, 999), 'pix', 'paid', 'infinitepay', p_transaction_nsu, now());

  return 'ok';
end;
$$;

revoke all on function public.confirmar_pagamento(text, text, text, int) from public;
grant execute on function public.confirmar_pagamento(text, text, text, int) to anon, authenticated;
