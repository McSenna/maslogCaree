import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (file: string) => readFileSync(new URL(`../admin/components/${file}`, import.meta.url), "utf8");

// Components that draw React Native cannot load under `node --test`, so this reads their source.
describe("the User accounts rows", () => {
  it("show no email in the table", () => {
    assert.doesNotMatch(read("wide/userColumns.tsx"), /user\.email/);
  });

  it("show no email on a phone row", () => {
    assert.doesNotMatch(read("phone/PhoneUserRow.tsx"), /user\.email/);
  });

  it("still fold the role under the name when its column is hidden", () => {
    assert.match(read("wide/userColumns.tsx"), /hiddenKeys\.has\("role"\) \? user\.role/);
  });
});
