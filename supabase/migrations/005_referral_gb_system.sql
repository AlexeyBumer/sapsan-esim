-- ============================================================
-- Sapsan eSIM — реферальная система с начислением ГБ (22 июня 2026)
-- +5 ГБ рефереру, но только после ПЕРВОЙ оплаченной покупки друга.
-- Идемпотентно: безопасно запускать повторно.
-- ============================================================

-- 1. Отдельный баланс ГБ за рефералов (не путать с balance_usd — это деньги).
alter table public.profiles
  add column if not exists referral_gb_balance numeric(10,2) not null default 0;

-- 2. Журнал «кто кого пригласил» — пишется в момент регистрации по коду,
--    то есть сразу видно дату присоединения, даже если друг ничего не купил.
--    credited/credited_at заполняются позже, когда друг впервые оплатит заказ.
create table if not exists public.referral_log (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null references public.profiles(id) on delete cascade,
  referred_email text,
  credited boolean not null default false,
  credited_at timestamptz,
  created_at timestamptz not null default now(),
  unique (referred_id) -- у одного приглашённого только один реферер
);

alter table public.referral_log enable row level security;

-- Пользователь может видеть список СВОИХ рефералов (тех, кого пригласил).
drop policy if exists "read own referrals" on public.referral_log;
create policy "read own referrals"
  on public.referral_log for select
  using (auth.uid() = referrer_id);

-- Запись/обновление — только сервер (service_role), как и везде с деньгами/баллами.

-- 3. Атомарное начисление ГБ-бонуса (избегаем гонки при параллельных вебхуках).
create or replace function public.increment_referral_gb_balance(
  p_user_id uuid,
  p_amount numeric
)
returns void
language sql
security definer set search_path = public
as $$
  update public.profiles
  set referral_gb_balance = referral_gb_balance + p_amount
  where id = p_user_id;
$$;

-- ============================================================
-- Готово. Использование в коде:
-- - при регистрации по ?ref=КОД — insert в referral_log (auth/actions.ts)
-- - при первой оплате заказа приглашённого — update credited=true
--   + rpc increment_referral_gb_balance (src/app/api/heleket-webhook/route.ts)
-- ============================================================
