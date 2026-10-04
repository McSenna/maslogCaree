import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MasterListReview, MasterResidentRecord } from "../../../../services/userRequestTypes.ts";
import { choosableCandidates, linkChoiceSentence } from "../linkChoice.ts";

// Test fixtures only: invented records.
const record = (masterResidentId: string, extra: Partial<MasterResidentRecord> = {}): MasterResidentRecord =>
  ({ masterResidentId, isActive: true, missing: false, ...extra }) as MasterResidentRecord;

const review = (outcome: MasterListReview["outcome"], candidates: MasterResidentRecord[]): MasterListReview => ({
  checked: true,
  outcome,
  reasons: [],
  checkedAt: null,
  candidates,
  linkedRecord: null,
  verificationMethod: "admin_review",
});

describe("which master list records an admin may link on approval", () => {
  it("offers the candidates of an unclear check", () => {
    const picks = choosableCandidates(review("multiple_matches", [record("TEST-B1"), record("TEST-B2")]), true);
    assert.deepEqual(picks.map((pick) => pick.masterResidentId), ["TEST-B1", "TEST-B2"]);
  });
  it("offers nothing for a clean match, a decided request or no review", () => {
    assert.equal(choosableCandidates(review("matched", [record("TEST-A")]), true).length, 0);
    assert.equal(choosableCandidates(review("conflict", [record("TEST-A")]), false).length, 0);
    assert.equal(choosableCandidates(null, true).length, 0);
  });
  it("leaves out removed and inactive records", () => {
    const picks = choosableCandidates(
      review("partial_match", [record("TEST-A", { missing: true }), record("TEST-D", { isActive: false }), record("TEST-F")]),
      true
    );
    assert.deepEqual(picks.map((pick) => pick.masterResidentId), ["TEST-F"]);
  });
});

describe("approve confirmation wording", () => {
  it("names the record being linked", () => {
    assert.match(linkChoiceSentence("TEST-B1", true), /TEST-B1/);
  });
  it("says the account stays unlinked only when a choice was offered", () => {
    assert.match(linkChoiceSentence(null, true), /stays unlinked/);
    assert.equal(linkChoiceSentence(undefined, false), "");
  });
});
