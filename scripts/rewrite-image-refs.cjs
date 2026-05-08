// Walks src/data/*.json and rewrites every "/images/foo.png|jpg" to ".webp",
// matching the optimize-images.cjs naming scheme (incl. the special ".optimal" strip).

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "src", "data");

function toWebp(p) {
  if (typeof p !== "string") return p;
  if (!p.startsWith("/images/")) return p;
  // strip ".optimal" before the final extension to match the converter's output
  return p.replace(/\.optimal(\.[a-z]+)$/i, "$1").replace(/\.(png|jpe?g)$/i, ".webp");
}

function walk(node) {
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === "object") {
    const out = {};
    for (const k of Object.keys(node)) out[k] = walk(node[k]);
    return out;
  }
  if (typeof node === "string") return toWebp(node);
  return node;
}

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
for (const f of files) {
  const p = path.join(DATA_DIR, f);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  const next = walk(data);
  fs.writeFileSync(p, JSON.stringify(next, null, 2));
  console.log("rewrote", f);
}
