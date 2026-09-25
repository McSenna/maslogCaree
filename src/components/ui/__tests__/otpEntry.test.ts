import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyOtpBackspace,
  applyOtpText,
  firstEmptyIndex,
  fromOtpSlots,
  isOtpComplete,
  navigateOtp,
  otpBoxMetrics,
  toOtpSlots,
} from "../otpEntry.ts";

const empty = () => toOtpSlots("", 6);

describe("digit entry", () => {
  it("fills the box and advances focus", () => {
    const edit = applyOtpText(empty(), 0, "4");
    assert.deepEqual(edit.slots, ["4", "", "", "", "", ""]);
    assert.equal(edit.focusIndex, 1);
  });

  it("keeps focus on the last box after the final digit", () => {
    const edit = applyOtpText(toOtpSlots("12345", 6), 5, "6");
    assert.equal(fromOtpSlots(edit.slots), "123456");
    assert.equal(edit.focusIndex, 5);
  });

  it("puts a digit where it was typed even when earlier boxes are empty", () => {
    const edit = applyOtpText(empty(), 3, "7");
    assert.deepEqual(edit.slots, ["", "", "", "7", "", ""]);
    assert.equal(fromOtpSlots(edit.slots), "   7");
    assert.equal(isOtpComplete(fromOtpSlots(edit.slots), 6), false);
  });

  it("replaces a filled box when typing over it without a selection", () => {
    const slots = toOtpSlots("123", 6);
    assert.equal(applyOtpText(slots, 1, "29").slots[1], "9");
    assert.equal(applyOtpText(slots, 1, "92").slots[1], "9");
    assert.equal(applyOtpText(slots, 1, "22").slots[1], "2");
  });

  it("replaces a selected digit (the box reports only the new character)", () => {
    const edit = applyOtpText(toOtpSlots("123456", 6), 2, "8");
    assert.equal(fromOtpSlots(edit.slots), "128456");
    assert.equal(edit.focusIndex, 3);
  });
});

describe("invalid characters", () => {
  it("rejects letters and symbols without moving focus", () => {
    const slots = toOtpSlots("12", 6);
    for (const text of ["a", "-", " ", "é", "٣"]) {
      const edit = applyOtpText(slots, 2, text);
      assert.deepEqual(edit.slots, slots, `accepted ${JSON.stringify(text)}`);
      assert.equal(edit.focusIndex, 2);
    }
  });

  it("drops non-digits from mixed input", () => {
    assert.equal(fromOtpSlots(applyOtpText(empty(), 0, "a1").slots), "1");
  });
});

describe("paste and autofill", () => {
  it("distributes a full code pasted into the first box", () => {
    const edit = applyOtpText(empty(), 0, "482913");
    assert.equal(fromOtpSlots(edit.slots), "482913");
    assert.equal(edit.focusIndex, 5);
  });

  it("fills from the first box whichever box receives a full code", () => {
    const edit = applyOtpText(toOtpSlots("99", 6), 4, "482913");
    assert.equal(fromOtpSlots(edit.slots), "482913");
  });

  it("ignores separators and whitespace in pasted codes", () => {
    for (const pasted of ["482 913", "482-913", " 482913\n", "Code: 482913"]) {
      assert.equal(fromOtpSlots(applyOtpText(empty(), 0, pasted).slots), "482913", pasted);
    }
  });

  it("truncates an over-long paste to the code length", () => {
    assert.equal(fromOtpSlots(applyOtpText(empty(), 0, "12345678").slots), "123456");
  });

  it("spreads a partial paste from the focused box onward", () => {
    const edit = applyOtpText(empty(), 2, "345");
    assert.deepEqual(edit.slots, ["", "", "3", "4", "5", ""]);
    assert.equal(edit.focusIndex, 5);
  });

  it("rejects a paste with no digits", () => {
    const slots = toOtpSlots("12", 6);
    assert.deepEqual(applyOtpText(slots, 0, "abcdef").slots, slots);
  });
});

describe("backspace", () => {
  it("clears a filled box and keeps focus there", () => {
    const edit = applyOtpBackspace(toOtpSlots("123", 6), 2);
    assert.equal(fromOtpSlots(edit.slots), "12");
    assert.equal(edit.focusIndex, 2);
  });

  it("steps back and clears the previous box from an empty box", () => {
    const edit = applyOtpBackspace(toOtpSlots("123", 6), 3);
    assert.equal(fromOtpSlots(edit.slots), "12");
    assert.equal(edit.focusIndex, 2);
  });

  it("does nothing on the first empty box", () => {
    const edit = applyOtpBackspace(empty(), 0);
    assert.deepEqual(edit.slots, empty());
    assert.equal(edit.focusIndex, 0);
  });

  it("clears a box via the platform's empty-text edit", () => {
    const edit = applyOtpText(toOtpSlots("123456", 6), 3, "");
    assert.equal(fromOtpSlots(edit.slots), "123 56");
    assert.equal(isOtpComplete(fromOtpSlots(edit.slots), 6), false);
  });
});

describe("keyboard navigation", () => {
  it("moves with arrow keys and clamps at the ends", () => {
    assert.equal(navigateOtp("ArrowRight", 2, 6), 3);
    assert.equal(navigateOtp("ArrowLeft", 2, 6), 1);
    assert.equal(navigateOtp("ArrowLeft", 0, 6), 0);
    assert.equal(navigateOtp("ArrowRight", 5, 6), 5);
  });

  it("jumps with Home and End", () => {
    assert.equal(navigateOtp("Home", 4, 6), 0);
    assert.equal(navigateOtp("End", 1, 6), 5);
  });

  it("ignores other keys", () => {
    assert.equal(navigateOtp("Tab", 1, 6), null);
    assert.equal(navigateOtp("5", 1, 6), null);
  });
});

describe("completeness and focus targets", () => {
  it("treats only six contiguous digits as complete", () => {
    assert.equal(isOtpComplete("123456", 6), true);
    assert.equal(isOtpComplete("12345", 6), false);
    assert.equal(isOtpComplete("12 456", 6), false);
    assert.equal(isOtpComplete("", 6), false);
  });

  it("round-trips slots through the form value", () => {
    const slots = ["1", "", "3", "", "", ""];
    assert.deepEqual(toOtpSlots(fromOtpSlots(slots), 6), slots);
    assert.equal(fromOtpSlots(empty()), "");
  });

  it("finds the first empty box for refocusing", () => {
    assert.equal(firstEmptyIndex(empty()), 0);
    assert.equal(firstEmptyIndex(toOtpSlots("12 4", 6)), 2);
    assert.equal(firstEmptyIndex(toOtpSlots("123456", 6)), 5);
  });
});

describe("responsive box sizing", () => {
  // Content widths the panel gets: 320px phone (dialog padding 20 each side, panel
  // unframed), 375px phone, and the framed desktop/tablet column (max 440 - 2×24 padding - 2px border).
  const cases = [
    { viewport: 320, width: 280 },
    { viewport: 375, width: 335 },
    { viewport: 768, width: 390 },
    { viewport: 1440, width: 390 },
  ];

  for (const { viewport, width } of cases) {
    it(`fits six boxes without overflow at ${viewport}px`, () => {
      const m = otpBoxMetrics(width, 6);
      const rowWidth = m.boxWidth * 6 + m.gap * 5;
      assert.ok(rowWidth <= width, `row ${rowWidth}px > ${width}px`);
      assert.ok(m.boxWidth >= 44, `box ${m.boxWidth}px narrower than 44px`);
      assert.ok(m.boxHeight >= 48, `box ${m.boxHeight}px shorter than 48px`);
    });
  }

  it("caps box width on wide containers", () => {
    assert.equal(otpBoxMetrics(1200, 6).boxWidth, 52);
  });

  it("never overflows even on an unusually narrow container", () => {
    const m = otpBoxMetrics(200, 6);
    assert.ok(m.boxWidth * 6 + m.gap * 5 <= 200);
  });
});
