import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");

// Residents use the Android app with no setup, and revoking a device is not a
// lockout, so no text may tell someone otherwise.
describe("device credentials are optional in the wording", () => {
  it("does not tell a resident a device must be provisioned", () => {
    assert.doesNotMatch(read("config/platformAccess.ts"), /must provision/i);
    assert.doesNotMatch(read("features/webAccess/ManagedDeviceSetup.tsx"), /need a credential/i);
  });

  it("does not tell an admin that revoking locks the resident out", () => {
    const control = read("features/webAccess/ManagedDevicesControl.tsx");
    assert.doesNotMatch(control, /will need a new provisioned credential/i);
    assert.match(control, /deactivate the account/i);
  });

  it("tells someone with a bad saved credential how to get past it", () => {
    const policy = read("utils/errorToast/errorToastPolicy.ts");
    assert.doesNotMatch(policy, /Ask the administrator to provision this device/);
    assert.match(policy, /Remove the saved credential under Device setup/);
  });
});
