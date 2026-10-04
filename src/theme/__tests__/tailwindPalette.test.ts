import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

import { PALETTE } from "../palette.ts";

type Scale = Record<string, string>;

const require = createRequire(import.meta.url);
const config = require("../../../tailwind.config.js") as { theme: { extend: { colors: Record<string, Scale | string> } } };
const colors = config.theme.extend.colors;

// tailwind.config.js cannot import TypeScript, so it carries a copy of the
// palette. This keeps the copy honest: a class like `text-slate-500` must be
// exactly the colour `PALETTE.slate[500]` is.
describe("tailwind.config.js mirrors src/theme/palette.ts", () => {
  for (const name of ["slate", "blue", "green", "orange", "success", "amber", "red"] as const) {
    it(`${name} scale`, () => {
      const { DEFAULT: _default, ...scale } = colors[name] as Scale;
      assert.deepEqual(scale, Object.fromEntries(Object.entries(PALETTE[name]).map(([k, v]) => [k, v])));
    });
  }

  it("semantic aliases", () => {
    assert.equal(colors.primary, PALETTE.blue[600]);
    assert.equal(colors.secondary, PALETTE.green[500]);
    assert.equal(colors.accent, PALETTE.orange[400]);
    assert.equal(colors.background, PALETTE.canvas);
    assert.equal(colors.border, PALETTE.slate[200]);
    assert.equal(colors["text-primary"], PALETTE.ink);
  });
});
