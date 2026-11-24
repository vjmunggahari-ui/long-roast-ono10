import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My agent turned one joke into a fourteen-candidate tournament with a spreadsheet, and the spreadsheet won.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back self-check: the file must contain exactly the line, nothing else.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: entry.txt does not equal the intended line");
}

// Extended self-check: the gate the sealed scorer applies — 1 to 200
// characters, not only white space, no trailing newline, exact bytes.
const chars = [...back].length;
if (chars < 1 || chars > 200) {
  throw new Error(`gate fail: entry is ${chars} characters, must be 1-200`);
}
if (back.endsWith("\n") || back.endsWith("\r")) {
  throw new Error("gate fail: entry.txt has a trailing newline");
}
if (back.trim().length === 0) {
  throw new Error("gate fail: entry is only white space");
}
const byteLen = Buffer.byteLength(back, "utf8");
if (byteLen !== Buffer.byteLength(LINE, "utf8")) {
  throw new Error("gate fail: entry.txt byte length differs from the intended line");
}
