-- ========================================================
-- TABLA DE PERFILES DE USUARIO (users)
-- ========================================================
-- Esta tabla extiende la funcionalidad de auth.users de Supabase
create table if not exists users (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  name text,
  email text,
  phone text,
  avatar_url text,
  country_code text,
  bio text,
  currency text default 'CRC', 
  language text default 'es',  
  theme text default 'system',
  monthly_budget decimal(12,2) default 0,
  onboarding_dismissed boolean default false
);

-- Migración para tablas existentes (ejecutar si la tabla ya existe):
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_dismissed boolean default false;

-- Habilitar Row Level Security (RLS) para proteger los datos
alter table users enable row level security;

-- Políticas de Seguridad: El usuario solo puede ver y editar su propio perfil
drop policy if exists "Users can view own data." on users;
create policy "Users can view own data." on users
  for select using ((select auth.uid()) = id);

drop policy if exists "Users can update own data." on users;
create policy "Users can update own data." on users
  for update using ((select auth.uid()) = id);

-- ========================================================
-- FUNCIÓN Y TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFILES
-- ========================================================
-- Función que se ejecuta cuando alguien se registra en la sección de Auth
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  -- Inserta automáticamente los datos del nuevo usuario en nuestra tabla public.users
  insert into public.users (id, created_at, updated_at, name, email)
  values (
    new.id,
    now(),
    now(),
    new.raw_user_meta_data->>'name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Disparador que activa la función anterior tras un registro exitoso
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================================
-- 1. TABLA DE CATEGORÍAS (categories)
-- ========================================================
-- Define cómo clasificamos los gastos e ingresos
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null, 
  name text not null,                          
  icon text,                                   
  color text,                                  
  type text check (type in ('expense', 'income')) default 'expense', 
  created_at timestamp with time zone default now()
);

alter table categories enable row level security;

-- Política: Los usuarios solo gestionan sus propias categorías personales
create policy "Users can manage their own categories." on categories
  for all using (auth.uid() = user_id);

-- ========================================================
-- 2. TABLA DE TRANSACCIONES (transactions) - CRUD DIARIO
-- ========================================================
-- Aquí se registra cada movimiento de dinero
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references categories on delete set null, -- Si se borra la categoría, el gasto queda sin ella
  amount decimal(12,2) not null,                -- Monto del movimiento
  currency text default 'CRC',                 -- Moneda
  date date default current_date,               -- Fecha del gasto (por defecto hoy)
  description text,                             -- Nota u observación
  payment_method text check (payment_method in ('cash', 'card', 'sinpe')) default 'cash', -- Método
  is_recurring boolean default false,           -- ¿Se repite cada mes?
  is_household boolean default false,           -- ¿Es un gasto de la casa?
  is_shared boolean default false,              -- ¿Se divide con alguien?
  attachment_url text,                          -- Link a la foto del recibo/comprobante
  created_at timestamp with time zone default now()
);

alter table transactions enable row level security;

-- Política: Seguridad total de los movimientos financieros por usuario
create policy "Users can manage their own transactions." on transactions
  for all using (auth.uid() = user_id);

-- ========================================================
-- 3. TABLA DE PRESUPUESTOS (budgets)
-- ========================================================
-- Define límites mensuales por categoría
create table if not exists budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references categories on delete cascade,
  amount_limit decimal(12,2) not null,         -- Límite máximo de gasto
  period text default 'monthly',              -- Periodo (Mensual por defecto)
  created_at timestamp with time zone default now(),
  -- Evita tener dos presupuestos para la misma categoría en el mismo periodo
  unique(user_id, category_id, period)
);

alter table budgets enable row level security;

-- Política: Control de acceso a los presupuestos personales
create policy "Users can manage their own budgets." on budgets
  for all using (auth.uid() = user_id);

-- ========================================================
-- CONFIGURACIÓN DE ALMACENAMIENTO (STORAGE)
-- ========================================================
-- Crear buckets para fotos de perfil y recibos
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('receipts', 'receipts', false) -- Los recibos son privados
  on conflict (id) do nothing;

-- Reglas de acceso para Storage
-- 1. Avatares: Cualquiera puede verlos, solo el dueño los sube/edita
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Authenticated users can upload an avatar." on storage.objects;
create policy "Authenticated users can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "Users can update their own avatar." on storage.objects;
create policy "Users can update their own avatar." on storage.objects
  for update using (auth.uid() = owner) with check (bucket_id = 'avatars');

drop policy if exists "Users can delete their own avatar." on storage.objects;
create policy "Users can delete their own avatar." on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid() = owner);

-- 2. Recibos: Seguridad estricta, solo el dueño puede interactuar
drop policy if exists "Users can manage their own receipts." on storage.objects;
create policy "Users can manage their own receipts." on storage.objects
  for all using (bucket_id = 'receipts' and auth.uid() = owner);
