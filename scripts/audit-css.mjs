import fs from "fs";
import path from "path";

const srcDir = "src";
const used = new Set();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8");
      const patterns = [
        /className\s*=\s*"([^"]*)"/g,
        /className\s*=\s*'([^']*)'/g,
        /className\s*=\s*\{`([^`]*)`\}/g,
        /className\s*=\s*\{\s*["']([^"']*)["']\s*\}/g,
      ];
      for (const re of patterns) {
        let m;
        while ((m = re.exec(text))) {
          for (const token of m[1].split(/\s+/)) {
            if (!token || token.includes("[") || token.includes(":")) continue;
            used.add(token);
          }
        }
      }
    }
  }
}

walk(srcDir);

let css = fs.readFileSync("src/app/globals.css", "utf8");
css = css.replace(/\/\*[\s\S]*?\*\//g, "");

const defined = new Set();
const selRe = /\.([a-zA-Z_][\w-]*)/g;
let mm;
while ((mm = selRe.exec(css))) defined.add(mm[1]);

const unused = [...defined].filter((c) => !used.has(c)).sort();
const missing = [...used].filter((c) => !defined.has(c) && c.includes("-")).sort();

console.log("Used:", used.size);
console.log("Defined:", defined.size);
console.log("Unused:", unused.length);
console.log("Unused sample:", unused.slice(0, 100).join(", "));
console.log("Missing sample:", missing.slice(0, 40).join(", "));

fs.writeFileSync(
  "scripts/css-audit.json",
  JSON.stringify({ unused, missing, used: [...used].sort() }, null, 2)
);
