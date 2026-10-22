-- Elemental database, part 1: accounts, display names and cloud saves.
-- Run in the Supabase SQL Editor. Safe to run more than once.

-- Players' public display names (one row per signed-in player)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_display_name_unique
  on public.profiles (lower(display_name));

-- Words that can't appear anywhere in a display name
create table if not exists public.name_blocklist (
  word text primary key
);

-- One cloud save per player
create table if not exists public.saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint saves_size check (pg_column_size(data) < 3000000)
);

-- The server sets the save time, so device clocks never matter
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end $$;
drop trigger if exists saves_touch on public.saves;
create trigger saves_touch before insert or update on public.saves
  for each row execute function public.touch_updated_at();

-- Row level security: nobody can touch anything unless a policy allows it
alter table public.profiles enable row level security;
alter table public.saves enable row level security;
alter table public.name_blocklist enable row level security;

-- Anyone can read display names (the leaderboard needs them); names are only
-- ever changed through set_display_name below, which checks them
drop policy if exists "names are public" on public.profiles;
create policy "names are public" on public.profiles
  for select using (true);

-- Players can only read and write their own save
drop policy if exists "read own save" on public.saves;
create policy "read own save" on public.saves
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "create own save" on public.saves;
create policy "create own save" on public.saves
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "update own save" on public.saves;
create policy "update own save" on public.saves
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select on public.profiles to anon, authenticated;
grant select, insert, update on public.saves to authenticated;

-- Choosing or changing a display name.
-- Returns 'ok', 'invalid', 'blocked', 'taken' or 'signed_out'.
create or replace function public.set_display_name(new_name text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  n text := btrim(coalesce(new_name, ''));
  flat_i text;
  flat_l text;
begin
  if uid is null then
    return 'signed_out';
  end if;
  if n !~ '^[A-Za-z0-9_]{3,16}$' then
    return 'invalid';
  end if;
  -- catch simple disguises: 0→o, 1→i or l, 3→e, 4→a, 5→s, 7→t, underscores removed
  flat_i := translate(lower(n), '013457_', 'oieast');
  flat_l := translate(lower(n), '013457_', 'oleast');
  if exists (select 1 from public.name_blocklist b
             where position(b.word in flat_i) > 0 or position(b.word in flat_l) > 0) then
    return 'blocked';
  end if;
  if exists (select 1 from public.profiles p where lower(p.display_name) = lower(n) and p.id <> uid) then
    return 'taken';
  end if;
  insert into public.profiles (id, display_name) values (uid, n)
    on conflict (id) do update set display_name = excluded.display_name;
  return 'ok';
exception when unique_violation then
  return 'taken';
end $$;
revoke all on function public.set_display_name(text) from public, anon;
grant execute on function public.set_display_name(text) to authenticated;

-- Starting blocklist. Short words that hide inside normal ones (like "ass" in
-- "classic") are left out on purpose. Add more any time with:
--   insert into public.name_blocklist values ('word');
insert into public.name_blocklist (word) values
  ('fuck'), ('shit'), ('cunt'), ('bitch'), ('bastard'), ('whore'), ('slut'),
  ('wank'), ('twat'), ('bollock'), ('pussy'), ('dildo'), ('penis'), ('vagina'),
  ('porn'), ('rape'), ('nigger'), ('nigga'), ('faggot'), ('retard'), ('spastic'),
  ('kike'), ('chink'), ('tranny'), ('paedo'), ('pedophile'), ('nazi'), ('hitler'),
  ('admin'), ('moderator')
on conflict do nothing;
