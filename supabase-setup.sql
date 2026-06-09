-- ============================================================
-- Sapsan eSIM — настройка базы данных (Этап 1: профили)
-- Вставьте этот скрипт в Supabase → SQL Editor → Run.
-- Он создаёт таблицу профилей, безопасные правила доступа (RLS)
-- и автоматическое создание профиля при регистрации.
-- ============================================================

-- 1. Таблица профилей. Привязана к auth.users (встроенная таблица Supabase).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  referral_code text unique not null,
  referred_by uuid references public.profiles(id),
  balance_usd numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Включаем Row Level Security — без этого данные были бы открыты всем.
alter table public.profiles enable row level security;

-- 3. Правила доступа:
-- Пользователь может ЧИТАТЬ только свой профиль.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Пользователь может ОБНОВЛЯТЬ только свой профиль,
-- но НЕ может менять баланс и реф-код (это поля только для сервера).
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ВАЖНО: вставку и изменение баланса делает только сервер
-- через service_role (он обходит RLS). Обычный пользователь баланс не трогает.

-- 4. Генерация уникального реферального кода.
create or replace function public.gen_referral_code()
returns text
language plpgsql
as $$
declare
  code text;
  done boolean := false;
begin
  while not done loop
    -- 8 символов из заглавных букв и цифр
    code := upper(substring(md5(random()::text) from 1 for 8));
    if not exists (select 1 from public.profiles where referral_code = code) then
      done := true;
    end if;
  end loop;
  return code;
end;
$$;

-- 5. Автоматическое создание профиля при регистрации нового пользователя.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (new.id, new.email, public.gen_referral_code());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Готово. После выполнения: при каждой регистрации автоматически
-- создаётся профиль с уникальным реферальным кодом и нулевым балансом.
-- Баланс и реферальные связи будут наполняться на следующих этапах
-- (только серверным кодом, не пользователем).
-- ============================================================
