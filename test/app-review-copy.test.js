import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Product Testing Instructions stay within the 500-character Partner Center limit", async () => {
  const document = await readFile(new URL("../docs/APP_REVIEW.md", import.meta.url), "utf8");
  const instructions = document.match(/^> (.+)$/m)?.[1] || "";
  assert.ok(instructions.length > 0);
  assert.ok(instructions.length <= 500, `Instructions are ${instructions.length} characters`);
  assert.match(instructions, /Data Sync/);
  assert.match(instructions, /Product IDs/);
  assert.match(instructions, /Order IDs/);
});
