import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  TOP_SAFE_GAP,
  clampMinHeight,
  keyboardOverlap,
  reservedEdges,
  sheetBottomInset,
  sheetMaxHeight,
} from "../sheetGeometry.ts";

// A tall Android phone (dp): 48dp status bar, 48dp navigation bar, 300dp keyboard.
const SCREEN = 915;
const STATUS_BAR = 48;
const KEYBOARD = 300;
const KEYBOARD_TOP = SCREEN - KEYBOARD;

/** Top edge of a bottom sheet of `contentHeight`, laid out as SheetViewport does. */
const sheetTop = ({
  containerHeight,
  keyboardTop,
  insetTop,
  contentHeight,
}: {
  containerHeight: number;
  keyboardTop: number | null;
  insetTop: number;
  contentHeight: number;
}) => {
  const overlap = keyboardOverlap({ containerBottom: containerHeight, keyboardTop });
  const edges = reservedEdges({ variant: "sheet", insetTop, bottomInset: 0 });
  const max = sheetMaxHeight({ containerHeight, overlap, reservedTop: edges.top });
  return containerHeight - overlap - Math.min(contentHeight, max);
};

describe("keyboard overlap is measured, never assumed", () => {
  it("is the keyboard height when the OS did not resize the modal", () => {
    assert.equal(keyboardOverlap({ containerBottom: SCREEN, keyboardTop: KEYBOARD_TOP }), KEYBOARD);
  });

  it("is zero when Android already shrank the modal to the keyboard's top", () => {
    assert.equal(keyboardOverlap({ containerBottom: KEYBOARD_TOP, keyboardTop: KEYBOARD_TOP }), 0);
  });

  it("is zero with no keyboard, and never negative", () => {
    assert.equal(keyboardOverlap({ containerBottom: SCREEN, keyboardTop: null }), 0);
    assert.equal(keyboardOverlap({ containerBottom: 400, keyboardTop: KEYBOARD_TOP }), 0);
  });
});

describe("the top edge never crosses the safe area", () => {
  const scenarios = [
    { name: "keyboard closed", containerHeight: SCREEN, keyboardTop: null },
    { name: "keyboard open, window not resized", containerHeight: SCREEN, keyboardTop: KEYBOARD_TOP },
    { name: "keyboard open, window resized by Android", containerHeight: KEYBOARD_TOP, keyboardTop: KEYBOARD_TOP },
    { name: "compact phone with a big keyboard", containerHeight: 640, keyboardTop: 640 - 330 },
  ];
  // Short and very long forms (e.g. registration with validation errors, large fonts).
  for (const contentHeight of [200, 900, 5000]) {
    for (const scenario of scenarios) {
      it(`${scenario.name}, ${contentHeight}dp of content`, () => {
        const top = sheetTop({ ...scenario, insetTop: STATUS_BAR, contentHeight });
        assert.ok(top >= STATUS_BAR + TOP_SAFE_GAP, `top ${top} < ${STATUS_BAR + TOP_SAFE_GAP}`);
      });
    }
  }

  it("does not double-lift: the sheet sits on the keyboard, not a keyboard-height above it", () => {
    const overlap = keyboardOverlap({ containerBottom: KEYBOARD_TOP, keyboardTop: KEYBOARD_TOP });
    const sheetBottom = KEYBOARD_TOP - overlap;
    assert.equal(sheetBottom, KEYBOARD_TOP);
  });

  it("caps to a share of the visible height when asked", () => {
    const max = sheetMaxHeight({ containerHeight: 1000, overlap: 0, reservedTop: 56, ratio: 0.9 });
    assert.equal(max, 900);
  });

  it("never returns a negative height", () => {
    assert.equal(sheetMaxHeight({ containerHeight: 100, overlap: 300, reservedTop: 56 }), 0);
  });
});

describe("edges and insets", () => {
  it("reserves the status bar plus the gap above a bottom sheet", () => {
    assert.deepEqual(reservedEdges({ variant: "sheet", insetTop: 47, bottomInset: 34 }), {
      top: 47 + TOP_SAFE_GAP,
      bottom: 0,
    });
  });

  it("keeps centred cards clear of the nav bar and at least edgePadding from each edge", () => {
    assert.deepEqual(reservedEdges({ variant: "centered", insetTop: 0, bottomInset: 0, edgePadding: 24 }), {
      top: 24,
      bottom: 24,
    });
    assert.deepEqual(reservedEdges({ variant: "centered", insetTop: 48, bottomInset: 48 }), {
      top: 48 + TOP_SAFE_GAP,
      bottom: 48 + TOP_SAFE_GAP,
    });
  });

  it("drops the home-indicator padding while the keyboard is up", () => {
    assert.equal(sheetBottomInset({ keyboardVisible: false, insetBottom: 34 }), 34);
    assert.equal(sheetBottomInset({ keyboardVisible: true, insetBottom: 34 }), 0);
  });

  it("never lets a preferred minimum exceed the maximum", () => {
    assert.equal(clampMinHeight(560, 320), 320);
    assert.equal(clampMinHeight(280, 600), 280);
    assert.equal(clampMinHeight(280, -5), 0);
  });
});
