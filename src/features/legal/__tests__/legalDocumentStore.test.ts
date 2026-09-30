import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  closeLegalDocumentDialog,
  openLegalDocumentDialog,
  subscribeToLegalDocument,
  type LegalDocumentKind,
} from "../legalDocumentStore.ts";

const record = () => {
  const seen: (LegalDocumentKind | null)[] = [];
  const unsubscribe = subscribeToLegalDocument((kind) => seen.push(kind));
  return { seen, unsubscribe };
};

afterEach(() => closeLegalDocumentDialog());

describe("legalDocumentStore", () => {
  it("replays the open document to a new subscriber", () => {
    openLegalDocumentDialog("terms");
    const { seen, unsubscribe } = record();
    assert.deepEqual(seen, ["terms"]);
    unsubscribe();
  });

  it("swaps documents in place and ignores repeat opens", () => {
    const { seen, unsubscribe } = record();
    openLegalDocumentDialog("privacy");
    openLegalDocumentDialog("privacy");
    openLegalDocumentDialog("terms");
    assert.deepEqual(seen, [null, "privacy", "terms"]);
    unsubscribe();
  });

  it("closes once and stays quiet when nothing is open", () => {
    const { seen, unsubscribe } = record();
    openLegalDocumentDialog("privacy");
    closeLegalDocumentDialog();
    closeLegalDocumentDialog();
    assert.deepEqual(seen, [null, "privacy", null]);
    unsubscribe();
  });

  it("stops notifying after unsubscribe", () => {
    const { seen, unsubscribe } = record();
    unsubscribe();
    openLegalDocumentDialog("terms");
    assert.deepEqual(seen, [null]);
  });
});
