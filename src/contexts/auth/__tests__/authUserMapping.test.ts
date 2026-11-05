import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AuthUser } from "../../../services/auth/authTypes.ts";
import { fromStoredUser, toCurrentUser, toStoredUser } from "../authUserMapping.ts";

const AUTH_USER: AuthUser = {
  _id: "abc",
  fullname: "Test Resident",
  email: "test@example.com",
  role: "resident",
  verified: true,
  civilStatus: "married",
  addressDetails: {
    houseNumberOrPurok: "Purok 5",
    barangay: "Maslog",
    cityMunicipality: "Legazpi City",
    province: "Albay",
  },
};

describe("auth user mapping", () => {
  it("carries civil status and the purok line from the server to the session", () => {
    const user = toCurrentUser(AUTH_USER);
    assert.equal(user.civilStatus, "married");
    assert.equal(user.houseOrPurok, "Purok 5");
  });

  it("reads an empty server value as known and blank", () => {
    const user = toCurrentUser({ ...AUTH_USER, civilStatus: "", addressDetails: null });
    assert.equal(user.civilStatus, "");
    assert.equal(user.houseOrPurok, "");
  });

  it("does not write them to the stored session", () => {
    const stored = toStoredUser(toCurrentUser(AUTH_USER), AUTH_USER, "token");
    assert.equal("civilStatus" in stored, false);
    assert.equal("houseOrPurok" in stored, false);
    assert.equal("addressDetails" in stored, false);
  });

  it("leaves them unknown after restoring a stored session", () => {
    const restored = fromStoredUser(toStoredUser(toCurrentUser(AUTH_USER), AUTH_USER, "token"));
    assert.equal(restored.civilStatus, undefined);
    assert.equal(restored.houseOrPurok, undefined);
  });
});
