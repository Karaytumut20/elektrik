import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const forbidden = [
  new RegExp("Prime" + "Sec", "i"),
  new RegExp("Prime" + " Sec", "i"),
  new RegExp("CC" + "TV", "i"),
  new RegExp("github" + "\\.com", "i"),
  new RegExp("prime" + "sec", "i"),
  new RegExp("ok" + "sid", "i"),
];
const ignored = new Set(["node_modules", ".next", ".git", "package-lock.json"]);
const ignoredFiles = new Set(["scripts/smoke-test.mjs"]);
const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".md", ".sql", ".svg", ".html", ".txt"]);

function extension(file) {
  const index = file.lastIndexOf(".");
  return index >= 0 ? file.slice(index) : "";
}

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    if (ignored.has(entry)) continue;
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      walk(path, files);
    } else if (textExtensions.has(extension(entry))) {
      files.push(path);
    }
  }
  return files;
}

const matches = [];
for (const file of walk(root)) {
  const relative = file.replace(`${root}/`, "");
  if (ignoredFiles.has(relative)) continue;
  const content = readFileSync(file, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(content)) matches.push(`${relative}: ${pattern}`);
  }
}

if (matches.length > 0) {
  console.error("Forbidden legacy references found:");
  console.error(matches.join("\n"));
  process.exit(1);
}

console.log("Smoke test passed: no forbidden legacy references found.");
