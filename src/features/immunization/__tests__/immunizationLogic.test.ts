import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAdministered,
  todayKey,
  validateAdministration,
  validateBirth,
  newBirthRequestKey, doseEntryErrors, doseIdentity, doseRequestOf } from "../immunizationLogic.ts";

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

describe("doseEntryErrors", () => {
  const now = new Date("2026-11-05T04:00:00Z");
  const entry = { administeredOn: "2026-06-20", birth: "2026-04-01", amending: false, voiding: false, reason: "" };

  it("accepts a valid new dose and leaves optional fields optional", () => {
    assert.deepEqual(doseEntryErrors(entry, now), {});
  });

  it("names the field for a missing, early or future date", () => {
    assert.match(doseEntryErrors({ ...entry, administeredOn: "" }, now).administeredOn ?? "", /actual date/);
    assert.match(doseEntryErrors({ ...entry, administeredOn: "2026-03-01" }, now).administeredOn ?? "", /before the baby/);
    assert.match(doseEntryErrors({ ...entry, administeredOn: "2026-12-01" }, now).administeredOn ?? "", /future/);
  });

  it("rejects a bad time and allows a blank one", () => {
    assert.ok(doseEntryErrors({ ...entry, administeredAt: "25:00" }, now).administeredAt);
    assert.equal(doseEntryErrors({ ...entry, administeredAt: "" }, now).administeredAt, undefined);
  });

  it("requires a clinician only on a historical dose", () => {
    assert.ok(doseEntryErrors({ ...entry, historical: true, administeredBy: " " }, now).administeredBy);
    assert.equal(doseEntryErrors({ ...entry, administeredBy: "" }, now).administeredBy, undefined);
  });

  it("requires a reason to change a saved dose, and only the reason to void it", () => {
    assert.ok(doseEntryErrors({ ...entry, amending: true }, now).reason);
    assert.deepEqual(doseEntryErrors({ ...entry, administeredOn: "", amending: true, voiding: true, reason: "Wrong baby" }, now), {});
  });
});

describe("doseIdentity", () => {
  it("assigns the signed-in midwife and the center to a new dose, whoever is signed in", () => {
    assert.deepEqual(doseIdentity(null, "Fixture Maria"), { clinician: "Fixture Maria", location: "Maslog Healthcare Center", keepsSaved: false });
    assert.equal(doseIdentity(null, "Fixture Ana").clinician, "Fixture Ana");
  });

  it("treats a deferred dose or a draft as still unassigned", () => {
    assert.equal(doseIdentity({ state: "deferred", administeredBy: "Old" }, "Fixture Ana").clinician, "Fixture Ana");
    assert.equal(doseIdentity({ state: "pending", administeredBy: "Old" }, "Fixture Ana").clinician, "Fixture Ana");
  });

  it("keeps who gave a saved dose, and where, when another midwife corrects it", () => {
    assert.deepEqual(doseIdentity({ state: "administered", administeredBy: "Fixture Maria", facility: "Earlier Clinic" }, "Fixture Ana"), { clinician: "Fixture Maria", location: "Earlier Clinic", keepsSaved: true });
  });

  it("assigns the signed-in midwife when a historical dose is corrected to one given here", () => {
    assert.equal(doseIdentity({ state: "administered", historical: true, administeredBy: "Paper nurse" }, "Fixture Ana").clinician, "Fixture Ana");
  });
});

describe("doseRequestOf", () => {
  it("sends no clinician or location for a dose given here", () => {
    assert.deepEqual(doseRequestOf({ administeredOn: "2026-01-01", administeredBy: "Typed", facility: "Typed", lotNumber: "L" }), { administeredOn: "2026-01-01", lotNumber: "L" });
  });

  it("sends what an earlier record says for a historical dose", () => {
    const historical = { administeredOn: "2026-01-01", historical: true, administeredBy: "Paper nurse", facility: "Hospital" };
    assert.deepEqual(doseRequestOf(historical), historical);
  });
});
