import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");

describe("resident mobile access requires a provisioned credential", () => {
  it("explains device setup on the native login and web restriction notice", () => {
    assert.match(read("config/platformAccess.ts"), /provisioned device credential/i);
    const setup = read("features/webAccess/ManagedDeviceSetup.tsx");
    assert.match(setup, /credential is required/i);
    assert.doesNotMatch(setup, /credential is optional/i);
  });
  it("explains that a revoked device needs a new credential", () => {
    const control = read("features/webAccess/ManagedDevicesControl.tsx");
    assert.match(control, /new credential/i);
    assert.doesNotMatch(control, /without a credential/i);
  });
  it("tells someone whose session lost device access how to restore it", () => {
    const policy = read("utils/errorToast/errorToastPolicy.ts");
    assert.match(policy, /Ask the administrator to provision this device/);
    assert.doesNotMatch(policy, /Remove the saved credential under Device setup, then sign in again/);
  });
});
