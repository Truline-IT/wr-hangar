The gragg.life creator portfolio, served by GitHub Pages at www.gragg.life.

- `/` portfolio home, built from `creators.json`; every project card sits on one line
- `shared/site.css` the common look every page links
- `_template/` starter page for a new project (see `CONTRIBUTING.md`)
- `/adams-hangar/` Moody.Adam's War Robots hangar tools (saved data lives in each visitor's browser; a first visit starts from `adams-hangar/seed.json`)
- `/adams-hangar/wiki/` wiki pages for every robot, weapon, drone and floor, reading `adams-hangar/data.js`
- `/adams-hanger/` catches the common misspelling and forwards to `/adams-hangar/`
- `/adamshanger/` forwards to `/adams-hangar/` too
- `/news/` patch notes (`news/patch-notes.json`, changes to Adam's gear marked) and latest videos from the War Robots YouTube channel; `.github/workflows/youtube-news.yml` refreshes `news/videos.json` every 4 hours through the YouTube Data API (needs the `YT_API_KEY` repository secret)
- `/noahs-hangar/` Noah's War Robots hangar, kept separate from Adam's (its own browser storage key)
- `CNAME` sets the custom domain; do not edit

`adams-hangar/data.js` is copied from the data block in `adams-hangar/index.html`. When the roster changes, update both until the hangar page is switched to read `data.js` directly.

## Site-wide search
Every page loads `shared/search.js`, which adds a search box (or a floating Search button on the hangar pages) covering wiki robots, titans, weapons, drones, floors, patch notes, pages and videos. Press `/` on any page to jump to it. The index is `shared/search-index.json`; rebuild it with `node tools/build-search-index.mjs` after `adams-hangar/data.js`, `creators.json` or `news/patch-notes.json` change.
