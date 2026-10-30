// Copies Adam's inventory from the hangar page (adams-hangar/index.html, the source of truth)
// into adams-hangar/data.js, which the wiki and the build tools read.
//
// Every top level `const NAME = ...` in data.js that also exists in the page's script is replaced
// with the page's version. Everything else in data.js (the level tables and image helpers that only
// the wiki needs) is left alone.
//
// Run from the repo root after editing the hangar data:  node tools/sync-data.mjs
import fs from "node:fs";

const page = fs.readFileSync("adams-hangar/index.html", "utf8");
const dataPath = "adams-hangar/data.js";
let data = fs.readFileSync(dataPath, "utf8");

/* Where the value of `const NAME =` ends: the first ; or newline at bracket depth 0, outside strings. */
function statementAt(src, name) {
  const m = new RegExp(`^const ${name}\\s*=`, "m").exec(src);
  if (!m) return null;
  let i = m.index + m[0].length, depth = 0, q = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") q = c;
    else if ("[{(".includes(c)) depth++;
    else if ("]})".includes(c)) depth--;
    else if (depth === 0 && (c === ";" || c === "\n") && src.slice(m.index + m[0].length, i).trim()) break;
  }
  return { start: m.index, end: c(src, i) };
  function c(s, j) { return s[j] === ";" ? j + 1 : j; }
}

const names = [...data.matchAll(/^const ([A-Z][A-Z0-9_]*)\s*=/gm)].map(m => m[1]);
const copied = [];
for (const name of names) {
  const from = statementAt(page, name), to = statementAt(data, name);
  if (!from || !to) continue;
  const text = page.slice(from.start, from.end);
  if (data.slice(to.start, to.end) === text) continue;
  data = data.slice(0, to.start) + text + data.slice(to.end);
  copied.push(name);
}
fs.writeFileSync(dataPath, data);
console.log(copied.length ? `data.js: updated ${copied.join(", ")} from the hangar page` : "data.js already matches the hangar page");
