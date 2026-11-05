import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PROFILE_ROLE_CONFIG, getProfileRoleConfig } from "../../config/profileRoleConfig.ts";
import type { ProfileFieldValues } from "../../config/profileFields.ts";
import { buildProfileSections, type ProfileSectionRow } from "../buildProfileSections.ts";

const VALUES: ProfileFieldValues = {
  fullName: "Test Resident",
  dateOfBirth: "April 16, 2005",
  age: "21 years old",
  gender: "Male",
  address: "Purok 5, Maslog",
  civilStatus: "Single",
  houseOrPurok: "Purok 5",
  email: "test@example.com",
  phone: null,
  role: "Doctor",
  dateJoined: "January 12, 2026",
  accountStatus: "Active",
};

const titled = (role: keyof typeof PROFILE_ROLE_CONFIG) =>
  buildProfileSections(PROFILE_ROLE_CONFIG[role].sections, VALUES).map((section) => section.title);

const STAFF_ORDER = [
  "Personal information",
  "Contact information",
  "Work information",
  "Account settings",
  "Help & support",
  "Legal",
  "About MaslogCare",
];

const fieldKeys = (rows: ProfileSectionRow[]) =>
  rows.flatMap((row) => (row.kind === "field" ? [row.key] : []));

describe("buildProfileSections", () => {
  for (const role of ["admin", "doctor", "midwife", "bhw"] as const) {
    it(`lists ${role} sections with work information`, () => {
      assert.deepEqual(titled(role), STAFF_ORDER);
    });
  }

  it("gives residents household information and no work section", () => {
    assert.deepEqual(titled("resident"), [
      "Personal information",
      "Contact information",
      "Household information",
      "Account settings",
      "Help & support",
      "Legal",
      "About MaslogCare",
    ]);
  });

  it("leaves out a section with nothing to show", () => {
    const { sections } = PROFILE_ROLE_CONFIG.resident;
    const withoutContact = sections.map((section) =>
      section.id === "contact" && section.kind === "fields" ? { ...section, fields: [] } : section
    );
    const ids = buildProfileSections(withoutContact, VALUES).map((section) => section.id);
    assert.equal(ids.includes("contact"), false);
    assert.equal(ids.includes("personal"), true);
  });

  it("pairs personal fields for the grid and gives long values the full width", () => {
    const sections = buildProfileSections(PROFILE_ROLE_CONFIG.midwife.sections, VALUES);
    const rowsOf = (id: string) => sections.find((section) => section.id === id)?.rows ?? [];
    assert.deepEqual(fieldKeys(rowsOf("personal")), ["fullName", "gender", "dateOfBirth", "age", "address"]);

    const fullWidth = sections
      .flatMap((section) => section.rows)
      .flatMap((row) => (row.kind === "field" && row.fullWidth ? [row.key] : []));
    assert.deepEqual(fullWidth, ["address", "email"]);
  });

  it("shows civil status only to residents, and only fields the backend stores", () => {
    const household = buildProfileSections(PROFILE_ROLE_CONFIG.resident.sections, VALUES).find(
      (section) => section.id === "household"
    );
    assert.deepEqual(fieldKeys(household?.rows ?? []), ["houseOrPurok", "civilStatus"]);

    const work = buildProfileSections(PROFILE_ROLE_CONFIG.doctor.sections, VALUES);
    const keys = work.flatMap((section) => fieldKeys(section.rows));
    assert.equal(keys.includes("civilStatus"), false);
    assert.deepEqual(fieldKeys(work.find((section) => section.id === "work")?.rows ?? []), [
      "role",
      "dateJoined",
      "accountStatus",
    ]);
  });

  it("never lists household number or emergency contact", () => {
    const labels = Object.values(PROFILE_ROLE_CONFIG)
      .flatMap((config) => buildProfileSections(config.sections, VALUES))
      .flatMap((section) => section.rows)
      .map((row) => row.label.toLowerCase());
    assert.equal(labels.some((label) => label.includes("household no")), false);
    assert.equal(labels.some((label) => label.includes("emergency")), false);
  });

  it("separates a missing value from one that has not loaded", () => {
    const sections = buildProfileSections(PROFILE_ROLE_CONFIG.resident.sections, {
      ...VALUES,
      phone: null,
      civilStatus: undefined,
    });
    const rows = sections.flatMap((section) => section.rows);
    const find = (key: string) => rows.find((row) => row.kind === "field" && row.key === key);
    assert.equal(find("phone")?.value, "Not provided");
    assert.equal(find("civilStatus")?.value, "Not available yet");
    const phone = find("phone");
    assert.equal(phone?.kind === "field" ? phone.provided : true, false);
  });

  it("opens personal and contact on phones and leaves the rest collapsed", () => {
    const expanded = PROFILE_ROLE_CONFIG.admin.sections
      .filter((section) => section.mobileExpanded)
      .map((section) => section.id);
    assert.deepEqual(expanded, ["personal", "contact"]);
  });
});

describe("profile role config", () => {
  it("keeps doctor and midwife as separate roles with their own identity", () => {
    assert.equal(PROFILE_ROLE_CONFIG.doctor.idPrefix, "DOC");
    assert.equal(PROFILE_ROLE_CONFIG.midwife.idPrefix, "MID");
    assert.equal(PROFILE_ROLE_CONFIG.doctor.title, "Doctor Profile");
    assert.equal(PROFILE_ROLE_CONFIG.midwife.title, "Midwife Profile");
    assert.equal(PROFILE_ROLE_CONFIG.resident.title, "My Profile");
    assert.equal(PROFILE_ROLE_CONFIG.bhw.idPrefix, "BHW");
    assert.equal(PROFILE_ROLE_CONFIG.admin.idPrefix, "ADM");
    assert.equal("staff" in PROFILE_ROLE_CONFIG, false);
  });

  it("falls back to the least privileged layout for an unknown role", () => {
    assert.equal(getProfileRoleConfig("unknown"), PROFILE_ROLE_CONFIG.resident);
    assert.equal(getProfileRoleConfig(" DOCTOR "), PROFILE_ROLE_CONFIG.doctor);
  });
});
