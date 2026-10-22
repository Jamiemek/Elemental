-- Test players: U1 is the admin "Jamiemek", U2 is "Other"
insert into public.profiles (id, display_name) values
  ('00000000-0000-0000-0000-000000000001', 'Jamiemek'),
  ('00000000-0000-0000-0000-000000000002', 'Other')
  on conflict do nothing;
insert into public.admins (user_id) values ('00000000-0000-0000-0000-000000000001') on conflict do nothing;
insert into vault.secrets_store values ('discord_webhook', 'https://discord.invalid/test');
