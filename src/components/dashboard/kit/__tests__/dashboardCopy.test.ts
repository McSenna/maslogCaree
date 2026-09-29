import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { greetingFor, greetingLine, greetingName, joinClauses, updatedLabel } from "../dashboardCopy.ts";

const at = (hour: number, minute = 0) => new Date(2026, 8, 29, hour, minute);

describe("greetingFor", () => {
  it("switches at noon and 6 pm", () => {
    assert.equal(greetingFor(at(0)), "Good morning");
    assert.equal(greetingFor(at(11, 59)), "Good morning");
    assert.equal(greetingFor(at(12)), "Good afternoon");
    assert.equal(greetingFor(at(17, 59)), "Good afternoon");
    assert.equal(greetingFor(at(18)), "Good evening");
  });
});

describe("greetingName", () => {
  it("uses the first name", () => {
    assert.equal(greetingName("Liza Mendoza"), "Liza");
    assert.equal(greetingName("  Maria   Clara Santos "), "Maria");
  });

  it("keeps a title with the surname", () => {
    assert.equal(greetingName("Dr. Jose Rizal"), "Dr. Rizal");
    assert.equal(greetingName("Dra Ana Cruz"), "Dra. Cruz");
  });

  it("does not treat a lone title as a name prefix", () => {
    assert.equal(greetingName("Doc"), "Doc");
  });

  it("returns an empty string for missing names", () => {
    assert.equal(greetingName(""), "");
    assert.equal(greetingName(null), "");
    assert.equal(greetingName(undefined), "");
  });
});

describe("greetingLine", () => {
  it("omits the comma when there is no name", () => {
    assert.equal(greetingLine("", at(9)), "Good morning");
    assert.equal(greetingLine("Ramon Cruz", at(19)), "Good evening, Ramon");
  });
});

describe("updatedLabel", () => {
  const now = at(10, 30);

  it("describes recent refreshes relative to now", () => {
    assert.equal(updatedLabel(at(10, 30).toISOString(), now), "Updated just now");
    assert.equal(updatedLabel(at(10, 26).toISOString(), now), "Updated 4 min ago");
    assert.equal(updatedLabel(at(9, 31).toISOString(), now), "Updated 59 min ago");
  });

  it("switches to a clock time after an hour", () => {
    assert.match(updatedLabel(at(9, 15).toISOString(), now), /^Updated at /);
  });

  it("returns nothing for unreadable input", () => {
    assert.equal(updatedLabel(undefined, now), "");
    assert.equal(updatedLabel("not a date", now), "");
  });
});

describe("joinClauses", () => {
  it("drops empty clauses and joins the rest as a sentence", () => {
    assert.equal(joinClauses([]), "");
    assert.equal(joinClauses(["3 waiting"]), "3 waiting");
    assert.equal(joinClauses(["3 waiting", "", "1 urgent"]), "3 waiting and 1 urgent");
    assert.equal(joinClauses(["a", "b", false, "c"]), "a, b and c");
  });
});
