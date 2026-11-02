import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAdministered,
  todayKey,
  validateAdministration,
  validateBirth,
  newBirthRequestKey,
} from "../immunizationLogic.ts";

describe("immunization clinical state", () => {
  it("uses the Manila calendar day at the UTC boundary", () => {
    assert.equal(todayKey(new Date("2026-10-22T15:59:59Z")), "2026-10-22");
    assert.equal(todayKey(new Date("2026-10-22T16:00:00Z")), "2026-10-23");
  });
  it("checks only an administered saved record", () => {
    assert.equal(isAdministered(null), false);
    assert.equal(isAdministered({ state: "deferred" }), false);
    assert.equal(isAdministered({ state: "void" }), false);
    assert.equal(isAdministered({ state: "administered" }), true);
  });
  it("requires a real administration date between birth and today", () => {
    const now = new Date(2026, 9, 23);
    assert.ok(validateAdministration("", "2026-01-01", now));
    assert.ok(validateAdministration("2026-02-30", "2026-01-01", now));
    assert.ok(validateAdministration("2025-12-31", "2026-01-01", now));
    assert.ok(validateAdministration("2026-10-24", "2026-01-01", now));
    assert.equal(validateAdministration("2026-10-23", "2026-01-01", now), "");
  });
  it("rejects future or impossible birth dates", () => {
    const now = new Date(2026, 9, 23);
    assert.ok(validateBirth("2026-10-24", now));
    assert.ok(validateBirth("2026-02-30", now));
    assert.equal(validateBirth("2026-10-23", now), "");
  });
  it("uses separate request keys for separate newborns", () => {
    assert.notEqual(newBirthRequestKey(), newBirthRequestKey());
  });
});
