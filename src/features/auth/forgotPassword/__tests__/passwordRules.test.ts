import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PASSWORD_MAX_LENGTH, meetsAllPasswordRules } from "../passwordRules.ts";

describe("password length rule", () => {
  it("caps passwords at 16 characters", () => {
    assert.equal(PASSWORD_MAX_LENGTH, 16);
  });

  it("accepts 8 through 16 characters and rejects anything longer", () => {
    assert.equal(meetsAllPasswordRules("Abcde1!x"), true);
    assert.equal(meetsAllPasswordRules("Abcde1!xAbcde1!x"), true);
    assert.equal(meetsAllPasswordRules("Abcde1!xAbcde1!xy"), false);
    assert.equal(meetsAllPasswordRules("Abcde1!"), false);
  });
});
