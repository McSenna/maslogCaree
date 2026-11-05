import assert from "node:assert/strict";
import { test } from "node:test";
import { permissionStatus } from "../permissionIdentity.ts";

const grants = (id: string, manageResidentWebAccess: boolean) => ({ user: { _id: id, permissions: { manageResidentWebAccess } } });

test("permission is checking until the server answers, then follows the answer", () => {
  assert.equal(permissionStatus("admin-one", null, false), "checking");
  assert.equal(permissionStatus("admin-one", grants("admin-one", true), false), "granted");
  assert.equal(permissionStatus("admin-one", grants("admin-one", false), false), "denied");
});
test("switching accounts cannot reuse a previous profile permission", () => {
  const previous = grants("admin-one", true);
  assert.equal(permissionStatus("admin-two", previous, false), "unavailable");
  assert.equal(permissionStatus(null, previous, false), "denied");
  assert.equal(permissionStatus("admin-one", { user: { permissions: { manageResidentWebAccess: true } } }, false), "unavailable");
});
test("a failed check is never reported as a denial or a grant", () => {
  assert.equal(permissionStatus("admin-one", null, true), "unavailable");
  assert.equal(permissionStatus("admin-one", grants("admin-one", true), true), "unavailable");
});
test("a server that does not report the permission is unavailable, not denied", () => {
  assert.equal(permissionStatus("admin-one", { user: { _id: "admin-one" } }, false), "unavailable");
  assert.equal(permissionStatus("admin-one", { user: { _id: "admin-one", permissions: {} } }, false), "unavailable");
});
