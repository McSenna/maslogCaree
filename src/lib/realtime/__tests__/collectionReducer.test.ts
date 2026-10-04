import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { defaultGetId, foldFirstPage, isStale, removeItem, replaceKnown, upsertItem } from "../collectionReducer.ts";
import { requestResync, onResync, subscribeToResource, dispatchRealtimeEvent, toChange } from "../realtimeBus.ts";

type Row = { _id: string; status: string; updatedAt?: string };

const options = { getId: (row: Row) => row._id };
const at = (minute: number) => `2026-10-03T08:${String(minute).padStart(2, "0")}:00.000Z`;

describe("upsertItem", () => {
  it("adds a new record first", () => {
    const next = upsertItem([{ _id: "a", status: "pending" }], { _id: "b", status: "pending" }, options);
    assert.deepEqual(next.map(defaultGetId), ["b", "a"]);
  });

  it("replaces a record by id in place", () => {
    const rows = [{ _id: "a", status: "pending", updatedAt: at(1) }, { _id: "b", status: "pending" }];
    const next = upsertItem(rows, { _id: "a", status: "confirmed", updatedAt: at(2) }, options);
    assert.equal(next[0].status, "confirmed");
    assert.equal(next.length, 2);
  });

  it("ignores the echo of a change the list already has", () => {
    const rows = [{ _id: "a", status: "confirmed", updatedAt: at(2) }];
    assert.equal(upsertItem(rows, { _id: "a", status: "confirmed", updatedAt: at(2) }, options), rows);
  });

  it("ignores an older version that arrives late", () => {
    const rows = [{ _id: "a", status: "completed", updatedAt: at(5) }];
    assert.equal(upsertItem(rows, { _id: "a", status: "confirmed", updatedAt: at(3) }, options), rows);
  });

  it("drops a record that no longer matches the view", () => {
    const pendingOnly = { ...options, accept: (row: Row) => row.status === "pending" };
    const rows = [{ _id: "a", status: "pending", updatedAt: at(1) }];
    assert.deepEqual(upsertItem(rows, { _id: "a", status: "confirmed", updatedAt: at(2) }, pendingOnly), []);
  });

  it("never adds a record that does not match the view", () => {
    const pendingOnly = { ...options, accept: (row: Row) => row.status === "pending" };
    const rows: Row[] = [];
    assert.equal(upsertItem(rows, { _id: "a", status: "confirmed" }, pendingOnly), rows);
  });

  it("keeps the server order when a sort is given", () => {
    const byId = { ...options, sort: (a: Row, b: Row) => a._id.localeCompare(b._id) };
    const next = upsertItem([{ _id: "a", status: "x" }, { _id: "c", status: "x" }], { _id: "b", status: "x" }, byId);
    assert.deepEqual(next.map(defaultGetId), ["a", "b", "c"]);
  });
});

describe("removeItem and isStale", () => {
  it("removes by id and returns the same array when the id is absent", () => {
    const rows = [{ _id: "a", status: "x" }];
    assert.deepEqual(removeItem(rows, "a", options.getId), []);
    assert.equal(removeItem(rows, "z", options.getId), rows);
  });

  it("compares unversioned records by content", () => {
    assert.equal(isStale({ _id: "a", status: "x" }, { _id: "a", status: "x" }), true);
    assert.equal(isStale({ _id: "a", status: "x" }, { _id: "a", status: "y" }), false);
  });
});

describe("paged list helpers", () => {
  it("replaces only rows the list already holds", () => {
    const rows = [{ _id: "a", status: "x", updatedAt: at(1) }];
    const next = replaceKnown(rows, [{ _id: "a", status: "y", updatedAt: at(2) }, { _id: "z", status: "y" }], options.getId);
    assert.deepEqual(next, [{ _id: "a", status: "y", updatedAt: at(2) }]);
    assert.equal(replaceKnown(rows, [{ _id: "z", status: "y" }], options.getId), rows);
  });

  it("puts a reloaded first page ahead of deeper pages without duplicates", () => {
    const loaded = [{ _id: "b", status: "x" }, { _id: "c", status: "x" }, { _id: "d", status: "x" }];
    const firstPage = [{ _id: "a", status: "x" }, { _id: "b", status: "y" }];
    assert.deepEqual(foldFirstPage(loaded, firstPage, options.getId).map(defaultGetId), ["a", "b", "c", "d"]);
  });
});

describe("realtimeBus", () => {
  it("routes resource events to subscribers as typed changes", () => {
    const seen: string[] = [];
    const stop = subscribeToResource("myAppointment", (change) => seen.push(change.action));
    dispatchRealtimeEvent("myAppointment:updated", { _id: "a" });
    dispatchRealtimeEvent("myAppointment:deleted", { id: "a" });
    dispatchRealtimeEvent("appointment:updated", { _id: "a" });
    stop();
    dispatchRealtimeEvent("myAppointment:created", { _id: "b" });
    assert.deepEqual(seen, ["updated", "deleted"]);
  });

  it("drops malformed payloads", () => {
    assert.equal(toChange("deleted", { id: 4 }), null);
    assert.equal(toChange("updated", null), null);
  });

  it("tells resync listeners when it happened", () => {
    let heard = 0;
    const stop = onResync((time) => {
      heard = time;
    });
    requestResync(42);
    stop();
    requestResync(99);
    assert.equal(heard, 42);
  });
});
