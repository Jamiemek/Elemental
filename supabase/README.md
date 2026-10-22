# Supabase set-up

Run these in order in the Supabase SQL Editor. Each is safe to run again, and together they
describe the live database. Later changes go in new numbered files (05, 06, ...).

| File | What it sets up |
|---|---|
| `01_accounts_and_saves.sql` | Display names (with the blocked-words list) and cloud saves |
| `02_global_top_10.sql` | Element odds (the game's adjusted odds) and the board's tables |
| `03_globals_admin.sql` | The boards, `submit_roll`, admins, game settings, bans, announcements, Discord posts, gifts, admin functions |
| `04_server_time.sql` | `server_time()`, used to check time away |

Nothing secret is stored here. The Discord webhook lives only in Supabase Vault
(name `discord_webhook`), and the game uses the public "publishable" key.

If element odds ever change in the game, `public.elements` must change to match, or the
server will score finds differently from the game.
