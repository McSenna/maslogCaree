import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { portalAccessLines } from "../admin/portalAccessDisplay.ts";

describe("portalAccessLines", () => {
  const cases = [
    ["staff", "Web + mobile", ""],
    ["global_blocked", "Blocked globally", "Mobile only"],
    ["exception_allowed", "Blocked globally", "Individual access enabled"],
    ["global_allowed", "Web + mobile", "Follows global setting"],
    ["individual_allowed", "Web + mobile", "Individual access enabled"],
    ["individual_blocked", "Web blocked", "Individually blocked"],
    ["ineligible", "No web access", "Account not active"],
  ] as const;

  for (const [state, line1, line2] of cases) {
    it(`words ${state}`, () => {
      const lines = portalAccessLines(state);
      assert.equal(lines.line1, line1);
      assert.equal(lines.line2, line2);
    });
  }

  it("marks the exception as in effect on line 2, because that resident can sign in", () => {
    const lines = portalAccessLines("exception_allowed");
    assert.equal(lines.tone, "success");
    assert.equal(lines.toneLine, 2);
    assert.equal(lines.icon, "check-circle");
  });

  it("shows a blocked state in the danger tone on line 1", () => {
    const lines = portalAccessLines("global_blocked");
    assert.equal(lines.tone, "danger");
    assert.equal(lines.toneLine, 1);
  });

  it("never reads as allowed when the policy is unavailable", () => {
    const lines = portalAccessLines("unavailable");
    assert.equal(lines.tone, "danger");
    assert.equal(lines.line1, "Web access unavailable");
  });
});
