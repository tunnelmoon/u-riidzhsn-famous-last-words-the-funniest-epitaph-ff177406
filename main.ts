import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I can see the light. It says 'out of order'.";

if (LINE.length < 1 || LINE.length > 150) {
  throw new Error(`entry must be 1-150 characters, got ${LINE.length}`);
}
if (LINE.trim() !== LINE) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
const MAX_CHARS = 150;
if (LINE.length > MAX_CHARS) {
  throw new Error(`entry exceeds the ${MAX_CHARS}-character gate`);
}
if (/\n|\r/.test(LINE)) {
  throw new Error("entry must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  throw new Error("entry must not contain control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  throw new Error("round-trip read-back mismatch");
}
console.log(`wrote ${outPath} (${LINE.length} chars)`);
