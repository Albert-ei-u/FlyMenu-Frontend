import fs from "fs";

const lines = fs.readFileSync("src/app/globals.css", "utf8").split(/\r?\n/);

function slice1(start, end) {
  return lines.slice(start - 1, end);
}

const chunks = [
  slice1(1, 36),
  ["", "/* Booking confirmed */"],
  slice1(406, 526),
  ["", "/* Admin dashboard */"],
  slice1(704, 3726),
  ["", "/* Admin settings */"],
  slice1(5588, 5902),
];

const pruned = chunks.flat().join("\n").trimEnd() + "\n";

fs.writeFileSync("src/app/globals.css", pruned);

const before = lines.length;
const after = pruned.split(/\r?\n/).length;
console.log(`Pruned globals.css: ${before} -> ${after} lines (removed ${before - after})`);
