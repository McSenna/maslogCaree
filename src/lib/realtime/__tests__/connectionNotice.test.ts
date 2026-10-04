import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createConnectionNotice } from "../connectionNotice.ts";

describe("createConnectionNotice", () => {
  it("announces once per outage, however many retries fail", () => {
    let announced = 0;
    const notice = createConnectionNotice(() => announced++);

    notice("connecting");
    notice("connected");
    notice("reconnecting");
    notice("reconnecting");
    assert.equal(announced, 0, "a short drop stays quiet");

    notice("offline");
    notice("offline");
    notice("reconnecting");
    notice("offline");
    assert.equal(announced, 1, "a reconnect loop is told once");
  });

  it("announces a new outage after the connection came back", () => {
    let announced = 0;
    const notice = createConnectionNotice(() => announced++);

    notice("offline");
    notice("connected");
    notice("offline");
    assert.equal(announced, 2);
  });

  it("starts fresh after the connection was closed on purpose", () => {
    let announced = 0;
    const notice = createConnectionNotice(() => announced++);

    notice("offline");
    notice("idle");
    notice("connecting");
    notice("offline");
    assert.equal(announced, 2);
  });
});
