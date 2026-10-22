import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CIVIL_STATUS_CHOICES, civilStatusLabel } from "../civilStatus.ts";

describe("civil status choices", () => {
  it("keeps the original four and adds the two single sub-statuses after Single", () => {
    assert.deepEqual(CIVIL_STATUS_CHOICES, [
      { value: "single", label: "Single" },
      { value: "single_live_in", label: "Single - Live In" },
      { value: "single_solo_parent", label: "Single - Solo Parent" },
      { value: "married", label: "Married" },
      { value: "widowed", label: "Widowed" },
      { value: "separated", label: "Separated" },
    ]);
  });

  it("labels stored values, including mixed case from older saves", () => {
    assert.equal(civilStatusLabel("single_live_in"), "Single - Live In");
    assert.equal(civilStatusLabel("single_solo_parent"), "Single - Solo Parent");
    assert.equal(civilStatusLabel("single"), "Single");
    assert.equal(civilStatusLabel(" Married "), "Married");
  });

  it("returns blank for a missing status and shows an unknown legacy value as-is", () => {
    assert.equal(civilStatusLabel(""), "");
    assert.equal(civilStatusLabel(undefined), "");
    assert.equal(civilStatusLabel(null), "");
    assert.equal(civilStatusLabel("divorced"), "Divorced");
  });
});
