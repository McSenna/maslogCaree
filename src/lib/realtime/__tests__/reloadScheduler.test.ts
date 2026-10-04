import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { createReloadScheduler } from "../reloadScheduler.ts";

const RELOAD_MS = 50;
const INTERVAL_MS = 300;

let clock = 0;
const now = () => clock;

// Each reload takes RELOAD_MS and records when it started, so the tests can
// check spacing and overlap against the same clock the scheduler reads.
const trackedReload = ({ fail = false } = {}) => {
  const starts: number[] = [];
  let active = 0;
  let maxActive = 0;
  const reload = () => {
    starts.push(clock);
    active += 1;
    maxActive = Math.max(maxActive, active);
    return new Promise<void>((resolve, reject) =>
      setTimeout(() => {
        active -= 1;
        if (fail) reject(new Error("offline"));
        else resolve();
      }, RELOAD_MS)
    );
  };
  return { reload, starts, maxActive: () => maxActive };
};

// Steps the fake clock 10ms at a time and lets promise callbacks run between steps.
const advance = async (ms: number) => {
  for (let elapsed = 0; elapsed < ms; elapsed += 10) {
    clock += 10;
    mock.timers.tick(10);
    await new Promise((resolve) => setImmediate(resolve));
  }
};

describe("createReloadScheduler", () => {
  beforeEach(() => {
    clock = 0;
    mock.timers.enable({ apis: ["setTimeout"] });
  });

  afterEach(() => {
    mock.timers.reset();
  });

  it("reloads at once on the first change", () => {
    const { reload, starts } = trackedReload();
    createReloadScheduler(reload, { intervalMs: INTERVAL_MS, now }).request();
    assert.deepEqual(starts, [0]);
  });

  it("folds changes that arrive during a reload into one more reload after it", async () => {
    const { reload, starts, maxActive } = trackedReload();
    const scheduler = createReloadScheduler(reload, { intervalMs: INTERVAL_MS, now });
    scheduler.request();
    await advance(20);
    scheduler.request();
    scheduler.request();
    scheduler.request();
    await advance(1000);
    assert.deepEqual(starts, [0, INTERVAL_MS]);
    assert.equal(maxActive(), 1);
  });

  it("keeps reloading at most once per interval while changes keep coming", async () => {
    const { reload, starts, maxActive } = trackedReload();
    const scheduler = createReloadScheduler(reload, { intervalMs: INTERVAL_MS, now });
    for (let change = 0; change < 10; change += 1) {
      scheduler.request();
      await advance(100);
    }
    await advance(1000);
    assert.ok(starts.length >= 4, `expected a reload about every ${INTERVAL_MS}ms, got ${starts.join(", ")}`);
    starts.slice(1).forEach((start, index) => assert.ok(start - starts[index] >= INTERVAL_MS, `starts ${starts.join(", ")}`));
    assert.equal(maxActive(), 1);
  });

  it("always reloads after the last change, even inside the interval", async () => {
    const { reload, starts } = trackedReload();
    const scheduler = createReloadScheduler(reload, { intervalMs: INTERVAL_MS, now });
    scheduler.request();
    await advance(120);
    scheduler.request();
    const lastChangeAt = clock;
    await advance(1000);
    assert.equal(starts.length, 2);
    assert.ok(starts[1] >= lastChangeAt);
  });

  it("does not reload when nothing changed", async () => {
    const { reload, starts } = trackedReload();
    createReloadScheduler(reload, { intervalMs: INTERVAL_MS, now });
    await advance(1000);
    assert.deepEqual(starts, []);
  });

  it("keeps going after a reload fails", async () => {
    const { reload, starts } = trackedReload({ fail: true });
    const scheduler = createReloadScheduler(reload, { intervalMs: INTERVAL_MS, now });
    scheduler.request();
    await advance(500);
    scheduler.request();
    await advance(500);
    assert.deepEqual(starts, [0, 500]);
  });

  it("treats a reload that returns nothing as finished", async () => {
    let calls = 0;
    const scheduler = createReloadScheduler(() => void (calls += 1), { intervalMs: INTERVAL_MS, now });
    scheduler.request();
    await advance(400);
    scheduler.request();
    assert.equal(calls, 2);
  });

  it("cancel drops a planned reload and the follow-up of a running one", async () => {
    const { reload, starts } = trackedReload();
    const scheduler = createReloadScheduler(reload, { intervalMs: INTERVAL_MS, now });
    scheduler.request();
    scheduler.request();
    scheduler.cancel();
    await advance(1000);
    scheduler.request();
    await advance(1000);
    assert.deepEqual(starts, [0]);
  });
});
