The gragg.life creator portfolio, served by GitHub Pages at www.gragg.life.

- `/` portfolio home, built from `creators.json`; every project card sits on one line
- `shared/site.css` the common look every page links
- `_template/` starter page for a new project (see `CONTRIBUTING.md`)
- `/adams-hangar/` Moody.Adam's War Robots hangar tools (saved data lives in each visitor's browser; a first visit starts from `adams-hangar/seed.json`)
- `/adams-hangar/wiki/` wiki pages for every robot, weapon, drone and floor, reading `adams-hangar/data.js`
- `/adams-hanger/` catches the common misspelling and forwards to `/adams-hangar/`
- `/adamshanger/` forwards to `/adams-hangar/` too
- `/news/` War Robots news. `.github/workflows/youtube-news.yml` runs every 4 hours and refreshes:
  - `news/official.json` and `news/patch-notes.json` from the developers' site, warrobots.com/en/news (a new UPDATE NOTES post becomes the latest patch notes, broken into balance changes, with Adam's gear marked)
  - `news/videos.json` from the War Robots YouTube channel, through the YouTube Data API (needs the `YT_API_KEY` secret)
  - `news/reddit.json` from r/walkingwarrobots, through Reddit's API (needs `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET`), shown as player posts
  - warrobots.wiki is fan-run and asks AI tools not to use its content, so the site links to it but never copies it
- `/noahs-hangar/` Noah's War Robots hangar, kept separate from Adam's (its own browser storage key)
- `CNAME` sets the custom domain; do not edit
- `.nojekyll` makes GitHub Pages serve folders that start with `_`, so `/_template/` opens

`adams-hangar/data.js` is copied from the data block in `adams-hangar/index.html`. When the roster changes, update both until the hangar page is switched to read `data.js` directly.

## Site-wide search
Every page loads `shared/search.js`, which adds a search box (or a floating Search button on the hangar pages) covering wiki robots, titans, weapons, drones, floors, patch notes, pages and videos. Press `/` on any page to jump to it. The index is `shared/search-index.json`; rebuild it with `node tools/build-search-index.mjs` after `adams-hangar/data.js`, `creators.json` or `news/patch-notes.json` change.

## Buff and nerf notes
`tools/build-patch-history.mjs` matches every balance change in `news/patch-notes.json` to each robot, titan, weapon and drone in `adams-hangar/data.js`, labels each line a buff or a nerf (smaller is better for cooldowns, intervals, visibility and similar; larger is better for everything else; "special skills do not apply" counts as a nerf), and writes `adams-hangar/patch-history.json`. The wiki shows it as a Patch history section on every item page and a Buffs and nerfs page (`/adams-hangar/wiki/#/changes`); the hangar floors show badges (`adams-hangar/badges.js`); the news page tags each change. The news workflow rebuilds it whenever new update notes arrive.
