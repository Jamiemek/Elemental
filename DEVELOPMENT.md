# Developing Elemental

Read README.md for the layout. The owner develops from a phone and doesn't hand-edit code.

## Workflow
- Edit `js/*.js`, `css/style.css`, `index.html`, never `game.js`. Then run `python3 tools/build.py`
  and commit `game.js` and `index.html` with the source change. `--check` must say "up to date".
- Every change gets a preview copy for the owner to try: `python3 tools/build.py --preview <file>`.
- Push to `main` only after the owner says to ship it. Afterwards, check the live site has it.
- Run the relevant tests in `tests/` (see tests/README.md) before handing anything over.
- Game changes that touch scoring, odds, elements or what gets announced may need matching SQL in
  `supabase/`. The owner pastes SQL into Supabase's SQL Editor; add new files as `05_...`, `06_...`.

## Rules the owner has set
- Element rarities don't change.
- Chain chance is never better than 1 in 3. At most 3 bonus rolls.
- Displayed odds and score are always base values, before luck and other buffs.
- The version label (APP_VERSION in js/odds.js) only changes when the owner says so. It is 1.51.
- Keep `IMG_3422.png`: it is the logo, used by Discord posts.
- The Discord webhook lives only in Supabase Vault. Never put it, the service-role key, the
  database password or the Google client secret in the repo or the game.
