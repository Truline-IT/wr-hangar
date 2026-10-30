// Matches every official balance change (news/patch-notes.json) to Adam's inventory
// (adams-hangar/data.js) and labels each change a buff or a nerf.
//
// Writes:
//   adams-hangar/patch-history.json   per item: every change across the updates, with a verdict
//   news/patch-notes.json             each balance item gets a "verdict" field for the news page
//
// Run from the repo root after either file changes:  node tools/build-patch-history.mjs
// The news workflow runs it after fetching new update notes.
import fs from "node:fs";
import vm from "node:vm";

const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ---------- 1. how to read one line of a balance change ---------- */
// Stats where a smaller number is better for the player who owns the item.
const LOWER_IS_BETTER = /cooldown|reload interval|shot interval|interval|dispersion|visibility distance|to activate|recharge time|charge time|deploy time|delay|spread|cost|price|upgrade time|time to (?!overheat)/i;
const num = s => parseFloat(String(s).replace(/,/g, "").replace(/(\d)\.(\d{3})(?!\d)/, "$1$2"));

function lineDirection(line, context) {
  const text = line.replace(/^-\s*/, "");
  if (/special skills? (do|does|won.t|will) not (apply|work)/i.test(text)) return "nerf";
  if (/no longer affect/i.test(text)) return "change";
  const label = (context ? context + " " : "") + text;
  const lowerBetter = LOWER_IS_BETTER.test(label);
  const m = text.match(/(-?[\d][\d.,]*)\s*%?\s*[a-z\/]*\s*→\s*(-?[\d][\d.,]*)/i);
  if (m) {
    const a = num(m[1]), b = num(m[2]);
    if (isNaN(a) || isNaN(b) || a === b) return "change";
    return (b > a) !== lowerBetter ? "buff" : "nerf";
  }
  const pct = text.match(/([+-−])\s*(\d[\d.,]*)\s*%/);
  if (pct) return ((pct[1] === "+") !== lowerBetter) ? "buff" : "nerf";
  return "change";
}

function itemVerdict(dirs) {
  const b = dirs.includes("buff"), n = dirs.includes("nerf");
  return b && n ? "mixed" : b ? "buff" : n ? "nerf" : "change";
}

/* ---------- 2. Adam's inventory ---------- */
const stub = () => ({ addEventListener() {}, classList: { toggle() {} }, dataset: {} });
const ctx = { document: { querySelectorAll: () => [], getElementById: () => null, querySelector: () => null, createElement: stub },
  window: {}, localStorage: { getItem: () => null, setItem() {} }, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("adams-hangar/data.js", "utf8") + ";this.__={R,TITANS,W,DRONES};", ctx);
const { R, TITANS, W, DRONES } = ctx.__;
const SLOT = { H: "heavy", M: "medium", L: "light" };
const inventory = [
  ...R.map(r => ({ kind: "robot", name: r[0] })),
  ...TITANS.map(t => ({ kind: "titan", name: t[0] })),
  ...W.map(w => ({ kind: "weapon", name: w[0], slot: SLOT[w[1]] || "" })),
  ...DRONES.map(n => ({ kind: "drone", name: n })),
];

// Words that dress up a name but are not the item itself ("Void Shoggoth" is a Shoggoth).
const DRESS = new Set(["mk2", "mk3", "ultimate", "noir", "blaze", "frozen", "retro", "cryptic", "freedom", "eldritch", "spirit",
  "steel", "sport", "royal", "omen", "unknown", "cruel", "fatal", "prototype", "ardent", "quicksand", "stellar", "void", "baihu",
  "martian", "neon", "special", "edition", "the", "of"]);
const words = n => String(n).toLowerCase().split(/[\s/()\-]+/).filter(w => w.length > 2);
function coreWords(name) {
  const all = words(name), core = all.filter(w => !DRESS.has(w));
  return core.length ? core : all;          // "Void" the titan weapon is still "void"
}
// Which inventory groups a patch group can speak about.
const GROUP_KINDS = { "Robots": ["robot"], "Robot weapons": ["weapon"], "Drones": ["drone"], "Titans": ["titan"],
  "Titan weapons": ["weapon"], "Changes": ["robot", "titan", "weapon", "drone"] };

/* For a family entry like "Hippo / Kroko / Liodari", keep only the lines about this weapon. */
function linesFor(item, entry) {
  const own = coreWords(item.name), out = [];
  let context = "";
  const family = entry.name.includes("/");
  const ownSize = (item.name.match(/-([LMH])$/i) || [])[1];                           // "Lumen-L"
  for (const raw of entry.lines) {
    const line = raw.trim();
    if (!line.includes("→") && /:$/.test(line)) { context = line.replace(/:$/, ""); continue; }
    if (!line.includes("→") && !/^[-+−]/.test(line) && !/%/.test(line) && !/special skills?/i.test(line) && !/no longer/i.test(line)) { context = line; continue; }
    if (family) {
      const sub = line.match(/^-\s*([A-Za-z][A-Za-z ']+?)(?::|\s+[\d-])/);           // "- Hippo 27,500 → 26,125"
      if (sub && !own.some(w => words(sub[1]).includes(w))) continue;
      const size = line.match(/^-\s*[A-Za-z]+-([LMH])\b/);                             // "- Lumen-M: 975 → 1500"
      if (size && ownSize && size[1].toUpperCase() !== ownSize.toUpperCase()) continue;
      const slot = line.match(/^(light|medium|heavy)\s*:/i);                          // "Light: 1,280 → 1,350"
      if (slot && item.slot && slot[1].toLowerCase() !== item.slot) continue;
    }
    out.push({ text: line, context, dir: lineDirection(line, context) });
  }
  return out;
}

/* ---------- 3. walk every update ---------- */
const pnPath = "news/patch-notes.json";
const pn = JSON.parse(fs.readFileSync(pnPath, "utf8"));
const updates = [pn.latest, ...(pn.archive || [])];
const history = {};

for (const u of updates) {
  for (const g of u.groups || []) {
    if (g.head === "Fixes") continue;
    for (const entry of g.items) {
      // label the entry itself for the news page
      const dirs = []; let context = "";
      for (const l of entry.lines) {
        if (!l.includes("→") && /:$/.test(l)) { context = l.replace(/:$/, ""); continue; }
        dirs.push(lineDirection(l, context));
      }
      entry.verdict = itemVerdict(dirs);

      const kinds = GROUP_KINDS[g.head];
      if (!kinds) continue;                    // pilots and motherships are not in the inventory data
      const entryWords = words(entry.name);
      for (const it of inventory) {
        if (!kinds.includes(it.kind)) continue;
        if (!coreWords(it.name).some(w => entryWords.includes(w))) continue;
        if (/ultimate/i.test(entry.name) !== /ultimate/i.test(it.name)) continue;   // Ultimate editions are separate items
        const lines = linesFor(it, entry);
        if (!lines.length) continue;
        const key = it.kind + "/" + slug(it.name);
        (history[key] ||= { kind: it.kind, name: it.name, changes: [] }).changes.push({
          ver: u.ver, title: u.title, url: u.url, group: g.head, entry: entry.name,
          anchor: `/news/#v${slug(u.ver)}-${slug(entry.name)}`,
          verdict: itemVerdict(lines.map(l => l.dir)), lines: lines.map(({ text, dir }) => ({ text, dir })),
        });
      }
    }
  }
}

// Every inventory item gets an entry, even with no changes, so the notes cover everything.
const versions = updates.map(u => u.ver);
const items = inventory.map(it => {
  const key = it.kind + "/" + slug(it.name);
  const h = history[key] || { kind: it.kind, name: it.name, changes: [] };
  const last = h.changes[0];
  h.latest = last ? { ver: last.ver, verdict: last.verdict } : null;
  h.note = last
    ? `${last.verdict === "buff" ? "Buffed" : last.verdict === "nerf" ? "Nerfed" : last.verdict === "mixed" ? "Buffed and nerfed" : "Changed"} in ${last.ver}` +
      (h.changes.length > 1 ? `; changed in ${h.changes.length} updates since ${versions[versions.length - 1]}` : "")
    : `No balance changes from ${versions[versions.length - 1]} to ${versions[0]}`;
  return [key, h];
});

fs.writeFileSync("adams-hangar/patch-history.json", JSON.stringify({ versions, items: Object.fromEntries(items) }, null, 1) + "\n");
fs.writeFileSync(pnPath, JSON.stringify(pn, null, 1) + "\n");

const count = v => items.filter(([, h]) => h.latest && h.latest.verdict === v).length;
console.log(`${items.length} inventory items, ${items.filter(([, h]) => h.changes.length).length} with changes;`,
  `latest verdicts: ${count("buff")} buffed, ${count("nerf")} nerfed, ${count("mixed")} mixed, ${count("change")} other`);
