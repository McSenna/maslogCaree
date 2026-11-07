import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { needsBirthDate, priorityGroupText, waitReasonText } from "../queueLabels.ts";

describe("priorityGroupText", () => {
  it("names every group in the required order", () => {
    const labels = [1, 2, 3, 4, 5, 6].map((group) => priorityGroupText({ prioritySortKey: group }));
    assert.deepEqual(labels, [
      "Group 1: Infants under 1 year",
      "Group 2: Adults 60 and older",
      "Group 3: Children 1 to 5",
      "Group 4: Children 6 to 12",
      "Group 5: Adolescents 13 to 17",
      "Group 6: Adults 18 to 59",
    ]);
  });

  it("prefers the server's label", () => {
    assert.equal(priorityGroupText({ prioritySortKey: 2, priorityGroupLabel: "Adults 60 and older" }), "Group 2: Adults 60 and older");
  });

  it("flags a missing birth date instead of showing a group number", () => {
    assert.equal(priorityGroupText({ prioritySortKey: 7 }), "Birth date needed");
    assert.equal(needsBirthDate({ prioritySortKey: 7 }), true);
    assert.equal(needsBirthDate({ prioritySortKey: 1 }), false);
  });

  it("never invents a group for a row the server has not ranked", () => {
    assert.equal(priorityGroupText({}), "Not ranked yet");
  });
});

describe("waitReasonText", () => {
  it("says what the queue is waiting for", () => {
    assert.match(waitReasonText("no_mission", "General Checkup") ?? "", /mission that offers General Checkup/);
    assert.match(waitReasonText("no_open_time", "Consultation") ?? "", /no open time/);
  });

  it("says nothing for services the queue does not place", () => {
    assert.equal(waitReasonText(null, "Prenatal"), null);
    assert.equal(waitReasonText(undefined, "Prenatal"), null);
  });
});
