import fs from "fs";

const lines = fs.readFileSync("src/app/globals.css", "utf8").split(/\r?\n/);

const globals = [
  ...lines.slice(0, 36),
  "",
  "/* Booking confirmed */",
  ...lines.slice(37, 158),
].join("\n");

const admin = [
  "/* FlyMenu admin panel — scoped to /admin routes */",
  ...lines.slice(160, 3390),
].join("\n");

fs.writeFileSync("src/app/globals.css", globals.trimEnd() + "\n");
fs.writeFileSync("src/styles/admin.css", admin.trimEnd() + "\n");

console.log(`globals.css: ${globals.split(/\r?\n/).length} lines`);
console.log(`admin.css: ${admin.split(/\r?\n/).length} lines`);
