import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getBreakpoint, gridColumnsFor, pickForBreakpoint, snapColumns } from "../breakpoints.ts";

describe("getBreakpoint", () => {
  it("maps the tested widths to the documented ranges", () => {
    const cases: [number, string][] = [
      [320, "mobile"], [360, "mobile"], [390, "mobile"], [412, "mobile"], [480, "mobile"],
      [767, "mobile"], [768, "tablet"], [1023, "tablet"], [1024, "desktop"], [1280, "desktop"],
      [1439, "desktop"], [1440, "wide"], [1920, "wide"],
    ];
    for (const [width, expected] of cases) assert.equal(getBreakpoint(width), expected, String(width));
  });
});

describe("pickForBreakpoint", () => {
  it("cascades down to the nearest defined smaller breakpoint", () => {
    const values = { mobile: 1, desktop: 3 };
    assert.equal(pickForBreakpoint("mobile", values), 1);
    assert.equal(pickForBreakpoint("tablet", values), 1);
    assert.equal(pickForBreakpoint("desktop", values), 3);
    assert.equal(pickForBreakpoint("wide", values), 3);
  });
});

describe("snapColumns", () => {
  it("picks the largest allowed column count that fits", () => {
    assert.equal(snapColumns(3, [1, 2, 4]), 2);
    assert.equal(snapColumns(4, [1, 2, 4]), 4);
    assert.equal(snapColumns(1, [2, 4]), 1);
  });
});

describe("gridColumnsFor", () => {
  it("fits as many minimum-width columns as the space allows, capped", () => {
    assert.equal(gridColumnsFor(340, 220, 4, 16), 1);
    assert.equal(gridColumnsFor(456, 220, 4, 16), 2);
    assert.equal(gridColumnsFor(1400, 220, 4, 16), 4);
    assert.equal(gridColumnsFor(1400, 220, 3, 16), 3);
  });

  it("never returns fewer than one column", () => {
    assert.equal(gridColumnsFor(0, 220, 4, 16), 1);
    assert.equal(gridColumnsFor(100, 220, 4, 16), 1);
  });
});
