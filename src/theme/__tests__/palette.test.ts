import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PALETTE } from "../palette.ts";

const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

const AA_TEXT = 4.5;

describe("palette contrast (WCAG AA body text)", () => {
  const pairs: [string, string, string][] = [
    ["white on primary", PALETTE.white, PALETTE.blue[600]],
    ["white on primary pressed", PALETTE.white, PALETTE.blue[700]],
    ["white on secondary", PALETTE.white, PALETTE.teal[700]],
    ["primary link on page", PALETTE.blue[600], PALETTE.mist],
    ["heading on page", PALETTE.ink, PALETTE.mist],
    ["muted on white", PALETTE.slate[600], PALETTE.white],
    ["muted on page", PALETTE.slate[600], PALETTE.mist],
    ["subtle on white", PALETTE.slate[500], PALETTE.white],
    ["subtle on page", PALETTE.slate[500], PALETTE.mist],
    ["dark primary on dark card", PALETTE.blue[400], PALETTE.slate[900]],
    ["dark muted on dark card", PALETTE.slate[400], PALETTE.slate[900]],
    ["dark subtle on dark card", "#7D8CA3", PALETTE.slate[900]],
  ];

  for (const [name, fg, bg] of pairs) {
    it(name, () => {
      const ratio = contrast(fg, bg);
      assert.ok(ratio >= AA_TEXT, `${name}: ${ratio.toFixed(2)}:1 is below ${AA_TEXT}:1`);
    });
  }

  it("keeps slate[400] out of the text tiers", () => {
    assert.ok(contrast(PALETTE.slate[400], PALETTE.white) < AA_TEXT);
  });
});
