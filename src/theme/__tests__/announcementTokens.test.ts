import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PALETTE } from "../palette.ts";
import {
  ANNOUNCEMENT_DARK,
  ANNOUNCEMENT_LIGHT,
  type AnnouncementPalette,
  type AnnouncementTokenName,
} from "../announcementTokens.ts";

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Every text colour against every surface it is drawn on.
const TEXT_PAIRS: [AnnouncementTokenName, AnnouncementTokenName][] = [
  ["ink", "page"], ["text2", "page"], ["text3", "neutral"],
  ["ink", "canvas"], ["ink", "rowopen"], ["ink", "shell"],
  ["text2", "canvas"], ["text2", "head"], ["text2", "rowopen"],
  ["text3", "canvas"], ["text3", "neutral"], ["body", "rowopen"],
  ["placeholder", "canvas"], ["brand", "canvas"], ["brand", "brand-tint"], ["brand", "avatar"],
  ["brand-on", "brand"], ["brand-on", "brand-hover"],
  ["destructive", "canvas"], ["destructive", "destructive-bg"],
  ["toast-text", "toast"], ["toast-action", "toast"],
];

const check = (name: string, palette: AnnouncementPalette) => {
  describe(`${name} palette`, () => {
    for (const [fg, bg] of TEXT_PAIRS) {
      it(`${fg} on ${bg} reaches 4.5:1`, () => {
        const ratio = contrast(palette[fg], palette[bg]);
        assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
      });
    }
  });
};

check("light", ANNOUNCEMENT_LIGHT);

describe("page background", () => {
  it("matches the admin dashboard page", () => {
    assert.equal(ANNOUNCEMENT_LIGHT.page, PALETTE.mist);
    assert.equal(ANNOUNCEMENT_DARK.page, PALETTE.slate[950]);
    assert.equal(ANNOUNCEMENT_DARK.canvas, PALETTE.slate[900]);
  });
});
check("dark", ANNOUNCEMENT_DARK);
