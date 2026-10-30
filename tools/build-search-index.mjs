// Builds shared/search-index.json for the site-wide search box.
// Run from the repo root after data.js, creators.json or news/patch-notes.json change:
//   node tools/build-search-index.mjs
import fs from "node:fs";
import vm from "node:vm";

const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = [];
const add = (t, k, u, s = "") => out.push({ t, k, u, s: String(s || "").slice(0, 160) });

// Site pages
const { creators } = JSON.parse(fs.readFileSync("creators.json", "utf8"));
for (const c of creators) for (const p of c.projects) add(p.title, "Page", p.url, `${c.name}. ${p.summary}`);
add("War Robots updates", "Page", "/news/", "Patch notes and videos from the official War Robots channel");

// Wiki records, read from the hangar data file (it expects a browser, so give it a stub)
const stub = () => ({ addEventListener() {}, classList: { toggle() {} }, dataset: {} });
const ctx = { document: { querySelectorAll: () => [], getElementById: () => null, querySelector: () => null, createElement: stub },
  window: {}, localStorage: { getItem: () => null, setItem() {} }, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("adams-hangar/data.js", "utf8") + ";this.__={R,TITANS,W,DRONES,DR,FLOORS};", ctx);
const { R, TITANS, W, DRONES, DR, FLOORS } = ctx.__;
const wiki = (kind, id) => `/adams-hangar/wiki/#/${kind}/${id}`;
const PH = (() => { try { return JSON.parse(fs.readFileSync("adams-hangar/patch-history.json", "utf8")).items; } catch { return {}; } })();
const note = (kind, name) => (PH[kind + "/" + slug(name)] || {}).note || "";
add("Buffs and nerfs", "Page", "/adams-hangar/wiki/#/changes", "Every item in Adam's hangar checked against the official update notes");
for (const r of R) add(r[0], "Robot", wiki("robot", slug(r[0])), `${note("robot", r[0])}. Floor ${r[1]}. ${r[6] || ""}`);
for (const t of TITANS) add(t[0], "Titan", wiki("titan", slug(t[0])), `${note("titan", t[0])}. Floor ${t[1]}`);
for (const w of W) add(w[0], "Weapon", wiki("weapon", slug(w[0])), [note("weapon", w[0]), w[7], w[5] ? w[5] + " m" : ""].filter(Boolean).join(". "));
const dinfo = Object.fromEntries(DR.map(d => [d[0], d]));
for (const n of DRONES) add(n, "Drone", wiki("drone", slug(n)), [note("drone", n), (dinfo[n] || [])[2]].filter(Boolean).join(". "));
for (const [n, f] of Object.entries(FLOORS)) add(`Floor ${f[0]}: ${f[1]}`, "Floor", wiki("floor", n), f[3]);

// Patch notes
const pn = JSON.parse(fs.readFileSync("news/patch-notes.json", "utf8"));
const L = pn.latest;
add(`War Robots ${L.ver} ${L.title}`, "Patch notes", `/news/#v${slug(L.ver)}`, L.highlights[0]);
for (const g of L.groups) for (const it of g.items)
  add(`${it.name} (${L.ver})`, "Patch notes", `/news/#v${slug(L.ver)}-${slug(it.name)}`, it.lines.join("; "));
for (const o of pn.older) for (const c of o.cards) add(`${c.head} (${o.ver})`, "Patch notes", `/news/#${slug(c.id)}`, c.body);

// Developers' news posts and Reddit threads, when the news job has fetched them
const readJson = f => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };
for (const p of readJson("news/official.json")?.posts || []) add(p.title, "Developers", p.url, `${p.category}, ${p.date}`);
for (const p of readJson("news/reddit.json")?.posts || []) add(p.title, "Reddit", p.url, `Player post${p.flair ? ", " + p.flair : ""}`);
for (const a of pn.archive || []) {
  add(`War Robots ${a.ver} ${a.title}`, "Patch notes", `/news/#v${slug(a.ver)}`, (a.highlights || [])[0]);
  for (const g of a.groups || []) if (g.head !== "Fixes") for (const it of g.items)
    add(`${it.name} (${a.ver})`, "Patch notes", `/news/#v${slug(a.ver)}-${slug(it.name)}`, it.lines.join("; "));
  for (const c of a.cards || []) add(`${c.head} (${a.ver})`, "Patch notes", `/news/#${slug(c.id)}`, c.body);
}

fs.writeFileSync("shared/search-index.json", JSON.stringify({ items: out }) + "\n");
console.log(out.length, "entries");
