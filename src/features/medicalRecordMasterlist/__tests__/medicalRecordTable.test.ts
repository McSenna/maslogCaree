import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (file: string) => readFileSync(new URL(`../components/${file}`, import.meta.url), "utf8");

// rowText.ts and the row components load through the app's alias, so this reads their source.
describe("the medical records table", () => {
  it("leaves the record ID out of the line under the resident's name", () => {
    assert.doesNotMatch(read("rowText.ts"), /recordReference/);
  });

  it("keeps the birth date on that line, to tell two people with one name apart", () => {
    assert.match(read("rowText.ts"), /dateOfBirth/);
  });

  it("still shows the reference when a record is opened", () => {
    assert.match(read("detail/RecordDetailContent.tsx"), /recordReference\(detail\._id\)/);
  });
});
