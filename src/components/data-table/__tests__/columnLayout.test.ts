import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cellSizing, minTableWidth, planColumns, type ColumnSizing } from "../columnLayout.ts";

const RESIDENT_RECORDS: ColumnSizing[] = [
  { key: "record", flex: 2.2, minWidth: 240 },
  { key: "birthDate", width: 120 },
  { key: "sex", width: 90, hideBelow: "lg" },
  { key: "civilStatus", width: 110, hideBelow: "lg" },
  { key: "address", flex: 1.8, minWidth: 180, hideBelow: "md" },
  { key: "appAccount", width: 140 },
  { key: "status", width: 120 },
  { key: "actions", width: 200 },
];

const keys = (columns: ColumnSizing[]) => columns.map((column) => column.key);

describe("cellSizing", () => {
  it("gives a fixed column exactly its width and never lets it grow or shrink", () => {
    assert.deepEqual(cellSizing({ key: "sex", width: 90 }), {
      width: 90,
      flexGrow: 0,
      flexShrink: 0,
    });
  });

  it("starts a fluid column at its minimum and grows it by its flex share", () => {
    assert.deepEqual(cellSizing({ key: "record", flex: 2.2, minWidth: 240 }), {
      flexGrow: 2.2,
      flexShrink: 0,
      flexBasis: 240,
      minWidth: 240,
    });
  });

  it("gives a fluid column without a minimum the default floor", () => {
    assert.equal(cellSizing({ key: "note" }).minWidth, 120);
  });
});

describe("planColumns", () => {
  it("shows every column on a wide desktop table", () => {
    const plan = planColumns(RESIDENT_RECORDS, 1920, 1400);
    assert.equal(plan.visible.length, 8);
    assert.equal(plan.scrolls, false);
    assert.equal(plan.contentWidth, undefined);
  });

  it("hides lg columns on a tablet window even before the table is measured", () => {
    const plan = planColumns(RESIDENT_RECORDS, 900, 0);
    assert.deepEqual([...plan.hiddenKeys], ["sex", "civilStatus"]);
  });

  it("drops the lowest tier first when the measured table is too narrow", () => {
    // 1200px of minimums; without Sex and Civil status 1000px.
    assert.equal(minTableWidth(RESIDENT_RECORDS), 1200);
    const plan = planColumns(RESIDENT_RECORDS, 1440, 1096);
    assert.deepEqual([...plan.hiddenKeys], ["sex", "civilStatus"]);
    assert.equal(plan.scrolls, false);
  });

  it("drops the next tier only when the first one was not enough", () => {
    const plan = planColumns(RESIDENT_RECORDS, 1280, 900);
    assert.deepEqual(keys(plan.visible), ["record", "birthDate", "appAccount", "status", "actions"]);
  });

  it("scrolls sideways at the essential columns' minimum width when nothing else can go", () => {
    const plan = planColumns(RESIDENT_RECORDS, 1280, 700);
    assert.equal(plan.scrolls, true);
    assert.equal(plan.contentWidth, 820);
  });
});
