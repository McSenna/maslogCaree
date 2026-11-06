import assert from "node:assert/strict";
import { test } from "node:test";
import { REGISTRATION_WEB_ACCESS_NOTICE } from "../registrationAccessCopy.ts";

test("web-restricted registration explains web access without claiming mobile is blocked", () => {
  assert.match(REGISTRATION_WEB_ACCESS_NOTICE.message, /web access has been disabled/i);
  assert.match(REGISTRATION_WEB_ACCESS_NOTICE.supporting, /mobile app is not affected/i);
});
test("no sign-in copy asks residents to set up or provision a device", () => {
  assert.doesNotMatch(Object.values(REGISTRATION_WEB_ACCESS_NOTICE).join(" "), /provision|device setup|device credential/i);
});
