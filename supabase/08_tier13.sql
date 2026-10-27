-- part 8: tier 13, for scores of a billion and up

create or replace function public.tier_for(sc double precision)
returns int language sql immutable as $$
  select count(*)::int from unnest(array[10000, 30000, 100000, 250000, 500000, 1000000, 1500000, 3000000, 12000000,
    30000000, 100000000, 300000000, 1000000000]::double precision[]) t
  where sc >= t;
$$;

-- "no tier" was 13, it's 14 now
do $$ begin
  if exists (select 1 from pg_constraint where conname = 'game_settings_min_tier_check'
             and pg_get_constraintdef(oid) like '%<= 13)%') then
    alter table public.game_settings drop constraint game_settings_min_tier_check;
    update public.game_settings set min_tier = 14 where min_tier = 13;
    alter table public.game_settings add constraint game_settings_min_tier_check check (min_tier between 1 and 14);
  end if;
end $$;

-- a colour for tier 13 posts
create or replace function public.discord_post(a public.announcements, p_rolls bigint, p_luck double precision, p_catalysts text, p_event text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  url text;
  colours int[] := array[10465448, 8177919, 6220500, 11771391, 16224216, 16765286, 16751196, 16735610, 13220095, 16774870, 4190463, 12868863, 16765806, 16777215];
  game text := 'https://jamiemek.github.io/Elemental/';
  head text;
  descr text;
begin
  if not (select discord_enabled from public.game_settings where id = 1) then
    return;
  end if;
  select decrypted_secret into url from vault.decrypted_secrets where name = 'discord_webhook' limit 1;
  if url is null then
    return;
  end if;
  head := case when a.tier > 0 then 'Tier ' || a.tier || ' find' else 'New global top 10 entry' end;
  descr := '**Odds** ' || public.fmt_odds(a.odds_log) || E'\n' ||
    '**Score** ' || public.fmt_big(log(greatest(a.score, 1))) ||
    case when a.rank_score <= 10 then E'\n🏆 **Global top 10** #' || a.rank_score else '' end || E'\n\n' ||
    concat_ws(' · ',
      case when p_rolls is not null then '**Rolls** ' || public.fmt_int(p_rolls) end,
      case when p_luck is not null then '**Luck** +' || public.fmt_int(p_luck) || '%' end) || E'\n' ||
    '**Catalysts** ' || coalesce(nullif(p_catalysts, ''), 'None') ||
    case when coalesce(p_event, '') <> '' then E'\n**Event** ' || p_event else '' end;
  perform net.http_post(
    url := url,
    body := jsonb_build_object('embeds', jsonb_build_array(jsonb_build_object(
      'color', colours[least(greatest(a.tier, 0), 13) + 1],
      'author', jsonb_build_object('name', head),
      'title', a.display_name || ' found ' || a.formula || public.ion_text(a.ion),
      'description', descr,
      'footer', jsonb_build_object('text', 'Elemental', 'icon_url', game || 'IMG_3422.png'),
      'timestamp', to_char(a.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    ))),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
exception when others then
  raise warning 'discord post failed: %', sqlerrm;
end $$;
revoke all on function public.discord_post(public.announcements, bigint, double precision, text, text) from public, anon, authenticated;
