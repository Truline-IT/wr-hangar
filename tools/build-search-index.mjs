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
for (const r of R) add(r[0], "Robot", wiki("robot", slug(r[0])), `Floor ${r[1]}. ${r[6] || ""}`);
for (const t of TITANS) add(t[0], "Titan", wiki("titan", slug(t[0])), `Floor ${t[1]}`);
for (const w of W) add(w[0], "Weapon", wiki("weapon", slug(w[0])), [w[7], w[5] ? w[5] + " m" : ""].filter(Boolean).join(". "));
const dinfo = Object.fromEntries(DR.map(d => [d[0], d]));
for (const n of DRONES) add(n, "Drone", wiki("drone", slug(n)), (dinfo[n] || [])[2]);
for (const [n, f] of Object.entries(FLOORS)) add(`Floor ${f[0]}: ${f[1]}`, "Floor", wiki("floor", n), f[3]);

// Patch notes
const pn = JSON.parse(fs.readFileSync("news/patch-notes.json", "utf8"));
const L = pn.latest;
add(`War Robots ${L.ver} ${L.title}`, "Patch notes", `/news/#v${slug(L.ver)}`, L.highlights[0]);
for (const g of L.groups) for (const it of g.items)
  add(`${it.name} (${L.ver})`, "Patch notes", `/news/#v${slug(L.ver)}-${slug(it.name)}`, it.lines.join("; "));
for (const o of pn.older) for (const c of o.cards) add(`${c.head} (${o.ver})`, "Patch notes", `/news/#${slug(c.id)}`, c.body);

fs.writeFileSync("shared/search-index.json", JSON.stringify({ built: new Date().toISOString().slice(0, 10), items: out }) + "\n");
console.log(out.length, "entries");
