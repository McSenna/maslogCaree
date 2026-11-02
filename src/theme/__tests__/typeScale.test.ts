import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

import { TABLE_TEXT } from "../../components/data-table/tableTokens.ts";
import { TYPE } from "../typography.ts";

const require = createRequire(import.meta.url);
const tailwind = require("../../../tailwind.config.js") as { theme: { extend: { fontSize: Record<string, unknown> } } };
const fontSizes = tailwind.theme.extend.fontSize;

// kape asked for every character and number to be larger, across the whole app (2026-11-03).
describe("the app's type scale", () => {
  it("raises the shared type tokens", () => {
    assert.equal(TYPE.caption.fontSize, 14);
    assert.equal(TYPE.body.fontSize, 16);
    assert.equal(TYPE.display.fontSize, 30);
  });

  it("raises the table tokens", () => {
    assert.equal(TABLE_TEXT.cell.fontSize, 15);
    assert.equal(TABLE_TEXT.badge.fontSize, 14);
    assert.equal(TABLE_TEXT.primary.fontSize, 16);
  });

  it("keeps each line height in step with its size", () => {
    assert.equal(TYPE.body.lineHeight, 22);
    assert.equal(TABLE_TEXT.cell.lineHeight, 20);
  });

  it("raises the Tailwind size classes", () => {
    assert.deepEqual(fontSizes.xs, ["13px", { lineHeight: "1.4" }]);
    assert.deepEqual(fontSizes.sm, ["14px", { lineHeight: "1.5" }]);
    assert.deepEqual(fontSizes.base, ["16px", { lineHeight: "1.5" }]);
  });
});
