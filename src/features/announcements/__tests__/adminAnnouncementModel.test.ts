import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Announcement } from "../admin/adminAnnouncement.types.ts";
import {
  EMPTY_FILTERS,
  countByStatus,
  expiryLong,
  expiryShort,
  filterAnnouncements,
  formatDay,
  hasActiveFilters,
  postedLine,
  statusOf,
  toAdminAnnouncement,
} from "../admin/adminAnnouncementModel.ts";
import { buildAnnouncementsCsv } from "../admin/announcementCsv.ts";

const NOW = new Date(2026, 8, 30, 10, 44);
const iso = (month: number, day: number) => new Date(2026, month, day, 9, 0).toISOString();

// Test fixtures only: built per test, never shipped in app code.
const make = (id: string, overrides: Partial<Announcement> = {}): Announcement => ({
  id,
  title: `Title ${id}`,
  body: `Body ${id}`,
  audience: "Everyone",
  authorName: "Test Author",
  createdAt: iso(8, 1),
  expiresAt: null,
  isDraft: false,
  eventAt: iso(9, 5),
  location: "Test location",
  ...overrides,
});

describe("toAdminAnnouncement", () => {
  it("maps API names onto the screen contract", () => {
    const mapped = toAdminAnnouncement({
      id: "a1",
      title: "T",
      message: "M",
      eventAt: iso(9, 5),
      location: "L",
      createdAt: iso(8, 1),
      postedBy: "Author",
    });
    assert.equal(mapped.body, "M");
    assert.equal(mapped.authorName, "Author");
    assert.equal(mapped.audience, "Everyone");
    assert.equal(mapped.expiresAt, null);
    assert.equal(mapped.isDraft, false);
  });
});

describe("status", () => {
  it("derives draft, expired and active in that order", () => {
    assert.equal(statusOf(make("1", { isDraft: true, expiresAt: iso(0, 1) }), NOW), "draft");
    assert.equal(statusOf(make("2", { expiresAt: iso(8, 29) }), NOW), "expired");
    assert.equal(statusOf(make("3", { expiresAt: iso(9, 29) }), NOW), "active");
    assert.equal(statusOf(make("4"), NOW), "active");
  });

  it("counts every item per tab", () => {
    const items = [make("1"), make("2", { isDraft: true }), make("3", { expiresAt: iso(8, 1) }), make("4")];
    assert.deepEqual(countByStatus(items, NOW), { all: 4, active: 2, draft: 1, expired: 1 });
  });
});

describe("filterAnnouncements", () => {
  const items = [
    make("1", { title: "Vaccination drive", audience: "Patients" }),
    make("2", { body: "Staff VACCINATION briefing", audience: "Staff" }),
    make("3", { title: "Clinic closed", isDraft: true }),
  ];

  it("matches title and body without case", () => {
    assert.deepEqual(filterAnnouncements(items, { ...EMPTY_FILTERS, query: " vaccination " }, NOW).map((i) => i.id), ["1", "2"]);
  });

  it("combines search, audience and status", () => {
    const filters = { query: "vaccination", audience: "Staff" as const, status: "active" as const };
    assert.deepEqual(filterAnnouncements(items, filters, NOW).map((i) => i.id), ["2"]);
    assert.deepEqual(filterAnnouncements(items, { ...EMPTY_FILTERS, status: "draft" }, NOW).map((i) => i.id), ["3"]);
    assert.ok(hasActiveFilters(filters));
    assert.ok(!hasActiveFilters(EMPTY_FILTERS));
  });
});

describe("formatting", () => {
  it("writes days as dd MMM yyyy", () => {
    assert.match(formatDay(iso(8, 2)), /^02 \S+ 2026$/);
    assert.equal(formatDay(null), "");
  });

  it("describes expiry for phone and wide layouts", () => {
    assert.equal(expiryShort(make("1"), NOW), "No expiry");
    assert.match(expiryShort(make("2", { expiresAt: iso(8, 1) }), NOW), /^Ended /);
    assert.match(expiryShort(make("3", { expiresAt: iso(9, 1) }), NOW), /^Until /);
    assert.equal(expiryLong(make("1"), NOW), "No expiry date");
    assert.match(expiryLong(make("2", { expiresAt: iso(8, 1) }), NOW), /^Expired /);
  });

  it("leaves out the author when unknown", () => {
    assert.match(postedLine(make("1")), / by Test Author$/);
    assert.doesNotMatch(postedLine(make("2", { authorName: null })), / by /);
  });
});

describe("buildAnnouncementsCsv", () => {
  it("quotes cells and defuses spreadsheet formulas", () => {
    const csv = buildAnnouncementsCsv([make("1", { title: '=HYPERLINK("x")', body: 'Say "hi"' })], NOW);
    const [header, row] = csv.split("\r\n");
    assert.match(header, /^"Title","Audience","Status"/);
    assert.match(row, /^"'=HYPERLINK\(""x""\)"/);
    assert.match(row, /"Say ""hi"""$/);
  });
});
