-- ============================================================
--  0009 — Mercado Pago (cartão recorrente)
--  Funções chamadas pelo webhook para ativar/desativar assinatura
--  por usuário (external_reference = user_id). Protegidas por segredo.
-- ============================================================

create or replace function public.ativar_assinatura_usuario(
  p_secret     text,
  p_user_id    uuid,
  p_gateway    text,
  p_sub_id     text,
  p_amount_cents int,
  p_period_end timestamptz,
  p_method     text,
  p_tx_id      text
) returns text
language plpgsql
security definer set search_path = public
as $$
begin
  if p_secret <> 'vdr_whk_7b87bcb2a323a8d530d6058978b88815e8023b01575aa9e6' then
    return 'unauthorized';
  end if;
  if p_user_id is null then
    return 'no_user';
  end if;

  insert into public.subscriptions
    (user_id, status, plano, price_cents, current_period_end, gateway, gateway_subscription_id, updated_at)
  values
    (p_user_id, 'active', 'mensal', coalesce(p_amount_cents, 999),
     coalesce(p_period_end, now() + interval '31 days'), p_gateway, p_sub_id, now())
  on conflict (user_id) do update set
    status = 'active',
    current_period_end = coalesce(p_period_end, now() + interval '31 days'),
    gateway = p_gateway,
    gateway_subscription_id = p_sub_id,
    canceled_at = null,
    updated_at = now();

  -- Registra o pagamento (idempotente por gateway_payment_id).
  if p_tx_id is not null and p_tx_id <> '' then
    if not exists (select 1 from public.payments where gateway_payment_id = p_tx_id) then
      insert into public.payments
        (user_id, amount_cents, method, status, gateway, gateway_payment_id, paid_at)
      values
        (p_user_id, coalesce(p_amount_cents, 999), coalesce(p_method, 'card'),
         'paid', p_gateway, p_tx_id, now());
    end if;
  end if;

  return 'ok';
end;
$$;

create or replace function public.desativar_assinatura_usuario(
  p_secret  text,
  p_user_id uuid
) returns text
language plpgsql
security definer set search_path = public
as $$
begin
  if p_secret <> 'vdr_whk_7b87bcb2a323a8d530d6058978b88815e8023b01575aa9e6' then
    return 'unauthorized';
  end if;
  update public.subscriptions
    set status = 'canceled', canceled_at = now(), updated_at = now()
    where user_id = p_user_id;
  return 'ok';
end;
$$;

revoke all on function public.ativar_assinatura_usuario(text,uuid,text,text,int,timestamptz,text,text) from public;
grant execute on function public.ativar_assinatura_usuario(text,uuid,text,text,int,timestamptz,text,text) to anon, authenticated;
revoke all on function public.desativar_assinatura_usuario(text,uuid) from public;
grant execute on function public.desativar_assinatura_usuario(text,uuid) to anon, authenticated;
