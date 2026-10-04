import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { UNKNOWN_MESSAGE } from "../../apiError/errorClassification.ts";
import { ERROR_CODES } from "../../errorCodes.ts";
import {
  createNoticeThrottle,
  errorToastReason,
  isAlreadyExplained,
  sessionEndNotice,
} from "../errorToastPolicy.ts";

const failure = (code: string, message = "The schedule is full.") => ({ code, message });

describe("isAlreadyExplained", () => {
  it("stays quiet for a request the app cancelled itself", () => {
    assert.equal(isAlreadyExplained(failure(ERROR_CODES.REQUEST_CANCELLED), false), true);
  });

  it("stays quiet for a refused session right after the sign-out notice", () => {
    assert.equal(isAlreadyExplained(failure(ERROR_CODES.TOKEN_EXPIRED), true), true);
    assert.equal(isAlreadyExplained(failure(ERROR_CODES.AUTHENTICATION_REQUIRED), true), true);
  });

  it("still reports a refused session when no sign-out notice was shown", () => {
    assert.equal(isAlreadyExplained(failure(ERROR_CODES.TOKEN_EXPIRED), false), false);
  });

  it("never hides a wrong password or a permission refusal", () => {
    assert.equal(isAlreadyExplained(failure(ERROR_CODES.INVALID_CREDENTIALS), true), false);
    assert.equal(isAlreadyExplained(failure(ERROR_CODES.FORBIDDEN), true), false);
  });
});

describe("errorToastReason", () => {
  it("uses the server's plain reason", () => {
    assert.equal(errorToastReason(failure(ERROR_CODES.CONFLICT), { fallback: "Not saved." }), "The schedule is full.");
  });

  it("swaps the generic unknown message for the caller's fallback", () => {
    assert.equal(errorToastReason(failure(ERROR_CODES.CLIENT_ERROR, UNKNOWN_MESSAGE), { fallback: "Not saved." }), "Not saved.");
    assert.equal(errorToastReason(failure(ERROR_CODES.UNKNOWN_ERROR, ""), { fallback: "Not saved." }), "Not saved.");
  });

  it("keeps the generic message when there is no fallback", () => {
    assert.equal(errorToastReason(failure(ERROR_CODES.CLIENT_ERROR, UNKNOWN_MESSAGE), {}), UNKNOWN_MESSAGE);
  });

  it("uses a fixed reason over the server's when one is given", () => {
    assert.equal(
      errorToastReason(failure(ERROR_CODES.INTERNAL_SERVER_ERROR), { reason: "Showing the last loaded information." }),
      "Showing the last loaded information."
    );
  });

  it("gives no reason when the form already shows it", () => {
    assert.equal(errorToastReason(failure(ERROR_CODES.CONFLICT), { inline: true, fallback: "Not saved." }), undefined);
  });
});

describe("createNoticeThrottle", () => {
  it("lets each key through once per window", () => {
    let clock = 0;
    const allow = createNoticeThrottle(60_000, () => clock);

    assert.equal(allow("Inventory not updated"), true);
    clock = 30_000;
    assert.equal(allow("Inventory not updated"), false, "a repeat inside the window is dropped");
    assert.equal(allow("Residents list not updated"), true, "another key has its own window");
    clock = 60_000;
    assert.equal(allow("Inventory not updated"), true, "the window has passed");
  });
});

describe("sessionEndNotice", () => {
  it("asks for a new login when the session simply expired", () => {
    assert.deepEqual(sessionEndNotice(ERROR_CODES.TOKEN_EXPIRED), {
      title: "Your session ended",
      description: "Log in again to continue.",
    });
  });

  it("points a closed account to the health center instead of the login form", () => {
    const notice = sessionEndNotice(ERROR_CODES.ACCOUNT_DISABLED);
    assert.equal(notice.title, "You have been signed out");
    assert.match(notice.description, /health center/);
  });

  it("tells a resident on the web where to sign in", () => {
    assert.match(sessionEndNotice(ERROR_CODES.RESIDENT_WEB_ACCESS_DENIED).description, /mobile app/);
  });

  it("never uses an em dash", () => {
    for (const code of Object.values(ERROR_CODES)) {
      const { title, description } = sessionEndNotice(code);
      assert.doesNotMatch(`${title} ${description}`, /\u2014/);
    }
  });
});
