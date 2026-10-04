import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { MENU_GAP, placeMenu } from "../menuPlacement.ts";

const VIEWPORT = { width: 1280, height: 800 };
const MENU = { width: 210, height: 180 };
const NO_INSETS = { top: 0, bottom: 0 };

describe("placeMenu", () => {
  it("opens under the button with right edges lined up", () => {
    const button = { x: 1000, y: 200, width: 44, height: 44 };
    assert.deepEqual(placeMenu(button, MENU, VIEWPORT, NO_INSETS), {
      top: 200 + 44 + MENU_GAP,
      left: 1044 - 210,
      flipped: false,
    });
  });

  it("flips above the button near the bottom of the screen", () => {
    const button = { x: 1000, y: 700, width: 44, height: 44 };
    const placed = placeMenu(button, MENU, VIEWPORT, NO_INSETS);
    assert.equal(placed.flipped, true);
    assert.equal(placed.top, 700 - MENU_GAP - 180);
  });

  it("keeps the safe area clear when deciding to flip", () => {
    const button = { x: 300, y: 560, width: 44, height: 44 };
    assert.equal(placeMenu(button, MENU, VIEWPORT, { top: 0, bottom: 0 }).flipped, false);
    assert.equal(placeMenu(button, MENU, VIEWPORT, { top: 0, bottom: 40 }).flipped, true);
  });

  it("stays inside the left edge on a narrow phone", () => {
    const button = { x: 20, y: 100, width: 44, height: 44 };
    assert.equal(placeMenu(button, MENU, { width: 360, height: 740 }, NO_INSETS).left, 8);
  });

  it("stays inside the right edge", () => {
    const button = { x: 1270, y: 100, width: 44, height: 44 };
    assert.equal(placeMenu(button, MENU, VIEWPORT, NO_INSETS).left, 1280 - 8 - 210);
  });

  it("pins to the screen when it fits neither below nor above", () => {
    const button = { x: 600, y: 120, width: 44, height: 44 };
    const placed = placeMenu(button, { width: 210, height: 700 }, VIEWPORT, NO_INSETS);
    assert.equal(placed.flipped, false);
    assert.equal(placed.top, 800 - 8 - 700, "as low as it can sit and still fit");
  });
});
