import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { portalAccessLines } from "../admin/portalAccessDisplay.ts";

describe("portalAccessLines", () => {
  const cases = [
    ["staff", "Web + mobile", ""],
    ["global_blocked", "Web access: OFF", "Blocked globally"],
    ["exception_allowed", "Web access: ON", "Individual access enabled"],
    ["global_allowed", "Web access: ON", "Follows global setting"],
    ["individual_allowed", "Web access: ON", "Individual access enabled"],
    ["individual_blocked", "Web access: OFF", "Individually blocked"],
    ["ineligible", "Web access: OFF", "Account not active"],
    ["unavailable", "Web access: OFF", "Setting unavailable"],
  ] as const;

  for (const [state, line1, line2] of cases) {
    it(`words ${state}`, () => {
      const lines = portalAccessLines(state);
      assert.equal(lines.line1, line1);
      assert.equal(lines.line2, line2);
    });
  }

  it("states ON or OFF first for every resident state, with the detail second", () => {
    const states = ["global_blocked", "exception_allowed", "global_allowed", "individual_allowed", "individual_blocked", "ineligible", "unavailable"] as const;
    for (const state of states) {
      const lines = portalAccessLines(state);
      assert.match(lines.line1, /^Web access: (ON|OFF)$/, state);
      assert.equal(lines.toneLine, 1, state);
    }
  });

  it("shows a blocked state in the danger tone on line 1", () => {
    const lines = portalAccessLines("global_blocked");
    assert.equal(lines.tone, "danger");
    assert.equal(lines.toneLine, 1);
  });

  it("never reads as allowed when the policy is unavailable", () => {
    const lines = portalAccessLines("unavailable");
    assert.equal(lines.tone, "danger");
    assert.equal(lines.line1, "Web access: OFF");
  });
});
