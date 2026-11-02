import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (file: string) => readFileSync(new URL(`../components/${file}`, import.meta.url), "utf8");

// Components that draw React Native cannot load under `node --test`, so this reads their source.
describe("the resident masterlist table", () => {
  const columns = read("masterListColumns.tsx");
  const phoneRow = read("MasterResidentPhoneRow.tsx");

  it("has no App account or Status column", () => {
    assert.doesNotMatch(columns, /key: "appAccount"/);
    assert.doesNotMatch(columns, /key: "status"/);
  });

  it("shows no resident ID on a row, at any width", () => {
    assert.doesNotMatch(columns, /masterResidentId/);
    assert.doesNotMatch(phoneRow, /masterResidentId/);
  });

  it("shows no account or status pill on a phone row", () => {
    assert.doesNotMatch(phoneRow, /AccountLinkPill|RecordStatusPill/);
  });

  it("keeps the columns that remain", () => {
    for (const key of ["record", "role", "birthDate", "sex", "civilStatus", "address", "actions"]) assert.match(columns, new RegExp(`key: "${key}"`));
  });
});
