import { test } from "node:test";
import assert from "node:assert/strict";
import { findEmoji } from "../scripts/check-emoji.mjs";

test("erkennt Emojis, Emoji-Varianten, Tastenkappen und Flaggen", () => {
  for (const sample of [
    "Los \u{1F697}",
    "Herz \u2764\uFE0F",
    "1\uFE0F\u20E3",
    "\u{1F1E9}\u{1F1EA}",
  ]) {
    assert.ok(findEmoji(sample).length > 0, `nicht erkannt: ${sample}`);
  }
});

test("lässt typografische Zeichen zu", () => {
  const sample = "© Apex Rent™ – 2.000 € → Mo–Fr 9–19 Uhr · DE / EN / NL";
  assert.deepEqual(findEmoji(sample), []);
});

test("nennt die Zeile der Fundstelle", () => {
  assert.deepEqual(findEmoji("ok\nnicht ok \u{1F697}"), [
    { line: 2, char: "\u{1F697}" },
  ]);
});
