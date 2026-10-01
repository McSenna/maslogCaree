import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { LEGAL_CATALOG, LEGAL_KINDS, otherLegalDocument } from "../constants/legalCatalog.ts";
import { LEGAL_DOCUMENTS, LEGAL_DRAFT_NOTICE } from "../content/index.ts";
import type { LegalBlock, LegalDocument } from "../types/legalDocument.types.ts";

const blockTexts = (block: LegalBlock): string[] => {
  switch (block.kind) {
    case "paragraph":
      return [block.text];
    case "list":
      return block.items;
    case "missing":
      return [block.label];
  }
};

const allTexts = (document: LegalDocument): string[] => [
  document.title,
  document.summary,
  ...document.sections.flatMap((section) => [section.heading, ...section.blocks.flatMap(blockTexts)]),
];

describe("legal catalog", () => {
  it("lists each document exactly once", () => {
    assert.deepEqual([...LEGAL_KINDS].sort(), Object.keys(LEGAL_CATALOG).sort());
    assert.equal(new Set(LEGAL_KINDS).size, LEGAL_KINDS.length);
  });

  it("routes each document to its own path", () => {
    for (const kind of LEGAL_KINDS) assert.equal(LEGAL_CATALOG[kind].route, `/${kind}`);
  });

  it("pairs each document with the other one", () => {
    for (const kind of LEGAL_KINDS) {
      assert.notEqual(otherLegalDocument(kind), kind);
      assert.equal(otherLegalDocument(otherLegalDocument(kind)), kind);
    }
  });
});

describe("legal documents", () => {
  for (const kind of LEGAL_KINDS) {
    const document = LEGAL_DOCUMENTS[kind];

    describe(kind, () => {
      it("matches its catalog entry", () => {
        assert.equal(document.kind, kind);
        assert.equal(document.title, LEGAL_CATALOG[kind].title);
      });

      it("has unique section ids, which are also render keys", () => {
        const ids = document.sections.map((section) => section.id);
        assert.equal(new Set(ids).size, ids.length, ids.join(", "));
      });

      it("has no empty headings, blocks or list items", () => {
        for (const section of document.sections) {
          assert.ok(section.heading.trim(), section.id);
          assert.ok(section.blocks.length > 0, section.id);
          for (const text of section.blocks.flatMap(blockTexts)) assert.ok(text.trim(), section.id);
        }
      });

      it("repeats no item within a list, since items are render keys", () => {
        for (const block of document.sections.flatMap((section) => section.blocks)) {
          if (block.kind === "list") assert.equal(new Set(block.items).size, block.items.length, block.items.join(" | "));
        }
      });

      it("follows the copy rules: no em dashes and no exclamation marks", () => {
        for (const text of allTexts(document)) {
          assert.doesNotMatch(text, /\u2014/, text);
          assert.doesNotMatch(text, /!/, text);
        }
      });
    });
  }

  it("keeps the draft notice in the same copy rules", () => {
    assert.doesNotMatch(`${LEGAL_DRAFT_NOTICE.lead} ${LEGAL_DRAFT_NOTICE.body}`, /\u2014|!/);
  });
});
