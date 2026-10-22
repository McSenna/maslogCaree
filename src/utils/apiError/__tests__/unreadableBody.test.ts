import assert from "node:assert/strict";
import { test } from "node:test";
import { isUnreadableJsonBody } from "../errorClassification.ts";

test("a JSON request answered with a web page or plain text never reached the API", () => {
  assert.equal(isUnreadableJsonBody(undefined, "<!DOCTYPE html><html><body>Sign in to this Wi-Fi</body></html>"), true);
  assert.equal(isUnreadableJsonBody("json", "Service unavailable"), true);
});

test("API envelopes, empty replies and file downloads are readable", () => {
  assert.equal(isUnreadableJsonBody(undefined, { success: true, data: [] }), false);
  assert.equal(isUnreadableJsonBody(undefined, [1, 2]), false);
  assert.equal(isUnreadableJsonBody(undefined, ""), false);
  assert.equal(isUnreadableJsonBody(undefined, undefined), false);
  assert.equal(isUnreadableJsonBody("blob", "binary"), false);
  assert.equal(isUnreadableJsonBody("text", "a,b"), false);
});
