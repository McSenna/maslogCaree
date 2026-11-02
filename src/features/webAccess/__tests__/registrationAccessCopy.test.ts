import assert from "node:assert/strict";
import { test } from "node:test";
import { registrationAccessNotice } from "../registrationAccessCopy.ts";

test("completed registration without device proof explains setup without claiming web is disabled", () => {
  const notice = registrationAccessNotice("DEVICE_CREDENTIAL_REQUIRED");
  assert.match(notice.title, /Account created/);
  assert.match(notice.message, /administrator.*provision/i);
  assert.doesNotMatch(notice.message, /web access has been disabled/i);
});
test("web-restricted registration explains web access without claiming mobile is blocked", () => {
  const notice = registrationAccessNotice("RESIDENT_WEB_ACCESS_DENIED");
  assert.match(notice.message, /web access has been disabled/i);
  assert.match(notice.supporting, /mobile app is not affected/i);
});
