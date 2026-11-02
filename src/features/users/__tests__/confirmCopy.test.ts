import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { confirmCopy, globalAccessCopy } from "../admin/confirmCopy.ts";

const NAME = "Test Resident";
const ACTIONS = ["deactivate", "reactivate", "approve", "resetPassword"] as const;

describe("confirmCopy", () => {
  for (const action of ACTIONS) {
    it(`${action} names the person, states the effect and has a verb and object button`, () => {
      const copy = confirmCopy(action, NAME);
      assert.ok(copy.title.includes(NAME) || copy.body.includes(NAME));
      assert.ok(copy.body.length > 10);
      assert.ok(copy.confirmLabel.split(" ").length >= 2);
      assert.equal(/—/.test(`${copy.title}${copy.body}${copy.confirmLabel}`), false);
    });
  }

  it("asks plainly before deactivating, and marks it destructive", () => {
    const copy = confirmCopy("deactivate", NAME);
    assert.equal(copy.title, "Deactivate Test Resident?");
    assert.equal(copy.destructive, true);
  });

  it("does not mark reactivating as destructive", () => {
    assert.equal(confirmCopy("reactivate", NAME).destructive, false);
  });

  it("warns that a role change alters what the person can reach", () => {
    const copy = confirmCopy("changeRole", NAME, "Midwife");
    assert.ok(copy.body.includes("Midwife"));
  });
});

describe("globalAccessCopy", () => {
  it("states that On opens the web to every eligible resident with no override", () => {
    assert.match(globalAccessCopy(true).body, /every eligible resident/i);
  });

  it("states that Off keeps residents with an individual exception signed in", () => {
    assert.match(globalAccessCopy(false).body, /individual/i);
    assert.equal(globalAccessCopy(false).destructive, true);
  });
});
