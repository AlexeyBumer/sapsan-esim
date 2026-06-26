-- ============================================================
-- Sapsan eSIM — Этап 2: таблицы orders и admin_sessions
-- Эта версия "ставится в git" задним числом — таблицы уже созданы
-- в Supabase вручную через SQL Editor. Скрипт написан идемпотентно
-- (IF NOT EXISTS / DROP POLICY IF EXISTS), поэтому повторный запуск
-- безопасен и ничего не сломает, если таблицы уже существуют.
-- ============================================================

-- 1. Заказы (платные и гостевые). Пишет только сервер (service_role).
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  heleket_order_id text unique not null,
  heleket_uuid text,
  mode text not null default 'new',           -- 'new' | 'topup'
  package_gb integer not null,
  amount_usd numeric(12,2) not null,
  payer_email text,
  esim_id text,                                 -- вписывает оператор вручную после оплаты
  payment_status text not null default 'pending', -- 'pending' | 'paid' | 'failed'
  referral_code text,                           -- добавлено отдельной миграцией 004, см. ниже
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.orders enable row level security;

-- Пользователь может читать только свои заказы. Вставка/обновление —
-- только через service_role в API-роутах (/api/checkout, /api/heleket-webhook).
drop policy if exists "read own orders" on public.orders;
create policy "read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- 2. Сессии операторов в Telegram-боте (авторизация по общему паролю).
create table if not exists public.admin_sessions (
  chat_id bigint primary key,
  authorized_until timestamptz,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.admin_sessions enable row level security;

-- Никаких публичных политик: таблицу читает/пишет только service_role
-- внутри /api/telegram-bot и /api/heleket-webhook. Обычным пользователям
-- (anon/authenticated) доступ закрыт полностью (RLS включён, политик нет).

-- ============================================================
-- Готово. После этого можно применять 003_fix_profiles_balance_rls.sql
-- и 004_orders_referral_code.sql (если ещё не применены).
-- ============================================================
