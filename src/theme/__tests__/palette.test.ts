import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PALETTE, mix, withAlpha } from "../palette.ts";

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
const AA_UI = 3;
const { blue, green, orange, slate, success, amber, red, night } = PALETTE;

describe("brand anchors", () => {
  it("keeps the eleven MaslogCare colours exactly", () => {
    assert.deepEqual(
      [blue[600], green[500], orange[400], PALETTE.canvas, PALETTE.white, PALETTE.ink, slate[500], success[500], amber[500], red[500], slate[200]],
      ["#2D5BFF", "#2BB673", "#FFA726", "#F5F7FA", "#FFFFFF", "#1F2933", "#64748B", "#22C55E", "#F59E0B", "#EF4444", "#E2E8F0"]
    );
  });
});

describe("palette contrast (WCAG AA body text)", () => {
  const pairs: [string, string, string][] = [
    ["white on primary", PALETTE.white, blue[600]],
    ["white on primary hover", PALETTE.white, blue[700]],
    ["white on danger fill", PALETTE.white, red[600]],
    ["primary link on page", blue[600], PALETTE.canvas],
    ["heading on page", PALETTE.ink, PALETTE.canvas],
    ["body on page", slate[700], PALETTE.canvas],
    ["muted on white", slate[600], PALETTE.white],
    ["muted on page", slate[600], PALETTE.canvas],
    ["subtle on white", slate[500], PALETTE.white],
    ["care text on white", green[700], PALETTE.white],
    ["accent text on white", orange[700], PALETTE.white],
    ["success text on its tint", success[700], success[50]],
    ["warning text on its tint", amber[700], amber[50]],
    ["danger text on its tint", red[700], red[50]],
    ["ink on accent fill", PALETTE.ink, orange[400]],
    ["dark heading on dark card", night.heading, night.surface],
    ["dark muted on dark card", night.muted, night.surface],
    ["dark subtle on dark raised", night.subtle, night.raised],
    ["dark primary on dark card", blue[400], night.surface],
    ["dark page text on dark primary", night.page, blue[400]],
  ];

  for (const [name, fg, bg] of pairs) {
    it(name, () => {
      const ratio = contrast(fg, bg);
      assert.ok(ratio >= AA_TEXT, `${name}: ${ratio.toFixed(2)}:1 is below ${AA_TEXT}:1`);
    });
  }

  it("keeps slate[400] and the light brand fills out of the text tiers", () => {
    for (const fill of [slate[400], green[500], orange[400], success[500], amber[500]]) {
      assert.ok(contrast(fill, PALETTE.white) < AA_TEXT, fill);
    }
  });
});

describe("palette contrast (WCAG 1.4.11 UI parts)", () => {
  const pairs: [string, string, string][] = [
    ["input outline on white", PALETTE.controlLine, PALETTE.white],
    ["dark input outline on dark card", night.control, night.surface],
    ["care icon on white", green[600], PALETTE.white],
    ["accent icon on white", orange[600], PALETTE.white],
    ["error icon on white", red[500], PALETTE.white],
    ["focus ring on page", blue[600], PALETTE.canvas],
    ["dark focus ring on dark card", blue[300], night.surface],
  ];

  for (const [name, fg, bg] of pairs) {
    it(name, () => {
      const ratio = contrast(fg, bg);
      assert.ok(ratio >= AA_UI, `${name}: ${ratio.toFixed(2)}:1 is below ${AA_UI}:1`);
    });
  }
});

describe("colour helpers", () => {
  it("withAlpha keeps the channel values", () => {
    assert.equal(withAlpha("#2D5BFF", 0.16), "rgba(45,91,255,0.16)");
  });

  it("mix blends toward the base", () => {
    assert.equal(mix("#FFFFFF", "#000000", 0.5), "#808080");
    assert.equal(mix("#2D5BFF", "#19212B", 0), "#19212B");
  });
});
