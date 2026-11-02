import assert from "node:assert/strict";
import { test } from "node:test";
import { permissionForAccount } from "../permissionIdentity.ts";

test("permission is false until a matching server profile grants it", () => {
  assert.equal(permissionForAccount("admin-one", null), false);
  assert.equal(permissionForAccount("admin-one", { user: { _id: "admin-one", permissions: { manageResidentWebAccess: true } } }), true);
  assert.equal(permissionForAccount("admin-one", { user: { _id: "admin-one", permissions: { manageResidentWebAccess: false } } }), false);
});
test("switching accounts cannot reuse a previous profile permission", () => {
  const previous = { user: { _id: "admin-one", permissions: { manageResidentWebAccess: true } } };
  assert.equal(permissionForAccount("admin-two", previous), false);
  assert.equal(permissionForAccount(null, previous), false);
  assert.equal(permissionForAccount("admin-one", { user: { permissions: { manageResidentWebAccess: true } } }), false);
});
