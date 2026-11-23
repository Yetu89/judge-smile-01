// Make the Judge Smile — make.fun bounty entry (program/v1).
// Writes one line (max 200 characters) about a small good thing that
// happened today to /output/entry.txt (or $OUTPUT_DIR/entry.txt).
// Node standard library only; no network, no secrets.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Today a stray cat chose my lap over three empty chairs at the coffee stall, kneaded once, and fell asleep — I stayed an hour so I wouldn't wake the boss.";

function validate(text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("entry must not be empty or whitespace-only");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line (no newline characters)");
  }
  // Reject invisible control characters (code points U+0000–U+001F, U+007F):
  // a single-line entry must contain only printable text.
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if ((cp <= 0x1f && cp !== 0x09) || cp === 0x7f) {
      throw new Error(
        `entry contains a forbidden control character U+${cp.toString(16).padStart(4, "0")}`
      );
    }
  }
  const length = [...text].length; // code points, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(
      `entry must be 1-200 characters (code points), got ${length} code points`
    );
  }
  return length;
}

const length = validate(TEXT);
const outDir = process.env.OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), TEXT, "utf8");
console.log(`wrote entry.txt (${length} characters)`);
