import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expected = path.normalize("contracts/orthogonal_proof.py");
const ignored = new Set([".git", "node_modules", ".pytest_cache", "__pycache__", "artifacts"]);
const pythonFiles: string[] = [];

function walk(directory: string): void {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile() && entry.name.endsWith(".py")) pythonFiles.push(path.normalize(path.relative(root, absolute)));
  }
}

walk(root);
const candidates = pythonFiles.filter((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  return /["']Depends["']\s*:|\bgl\.Contract\b|\bfrom\s+genlayer\s+import\b/.test(source);
});
if (candidates.length !== 1 || candidates[0] !== expected) {
  throw new Error(`Expected only ${expected}; selected: ${candidates.join(", ") || "none"}`);
}
console.log(`Contract discovery passed: ${expected}`);
