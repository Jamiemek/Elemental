# Elemental

A periodic-table roll game. Play it at https://jamiemek.github.io/Elemental/

## How the files fit together

| Path | What it is |
|---|---|
| `index.html` | The page: layout and screens. Loads `css/style.css` and `game.js`. |
| `css/style.css` | All the styles. |
| `js/*.js` | The game's code, split by area. **Edit these.** |
| `game.js` | The code players load: every file in `js/` joined in order by `tools/build.py`. **Don't edit it by hand.** |
| `themes/` | Empty for now. Unlockable themes (effect sets, scanners, page designs) will go here. |
| `supabase/` | The database set-up, in the order it was run in Supabase's SQL Editor. |
| `tests/` | Browser tests, a balance simulator and a local stand-in for Supabase. |
| `tools/` | The build script, and the extras that make the preview copy. |
| `privacy.html`, `IMG_3422.png` | Privacy policy and logo. |
