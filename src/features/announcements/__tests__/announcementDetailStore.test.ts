import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  closeAnnouncementDetail,
  openAnnouncementDetail,
  subscribeToAnnouncementDetail,
  type AnnouncementDetailRequest,
} from "../detail/announcementDetailStore.ts";

const record = () => {
  const seen: (AnnouncementDetailRequest | null)[] = [];
  const unsubscribe = subscribeToAnnouncementDetail((request) => seen.push(request));
  return { seen, unsubscribe, latest: () => seen[seen.length - 1] };
};

afterEach(() => closeAnnouncementDetail());

describe("announcementDetailStore", () => {
  it("replays the current request to a new subscriber", () => {
    openAnnouncementDetail("abc123", { title: "Vaccination drive", body: "Bring the card." });
    const { latest, unsubscribe } = record();
    assert.equal(latest()?.announcementId, "abc123");
    assert.deepEqual(latest()?.preview, { title: "Vaccination drive", body: "Bring the card." });
    unsubscribe();
  });

  it("treats a missing or blank id as unlinked so the dialog can fall back", () => {
    const { latest, unsubscribe } = record();
    openAnnouncementDetail(undefined);
    assert.equal(latest()?.announcementId, null);
    openAnnouncementDetail("   ");
    assert.equal(latest()?.announcementId, null);
    openAnnouncementDetail(null, { title: "Old alert", body: "" });
    assert.equal(latest()?.announcementId, null);
    assert.equal(latest()?.preview?.title, "Old alert");
    unsubscribe();
  });

  it("gives every open a new key so the dialog remounts with fresh state", () => {
    const first = openAnnouncementDetail("a");
    const second = openAnnouncementDetail("a");
    assert.notEqual(first, second);
  });

  it("ignores a stale close for a request that was already replaced", () => {
    const { latest, unsubscribe } = record();
    const stale = openAnnouncementDetail("first");
    openAnnouncementDetail("second");
    closeAnnouncementDetail(stale);
    assert.equal(latest()?.announcementId, "second");
    unsubscribe();
  });

  it("closes the matching request, or any request when no key is given", () => {
    const { latest, unsubscribe } = record();
    const key = openAnnouncementDetail("one");
    closeAnnouncementDetail(key);
    assert.equal(latest(), null);
    openAnnouncementDetail("two");
    closeAnnouncementDetail();
    assert.equal(latest(), null);
    unsubscribe();
  });

  it("stops notifying after unsubscribe", () => {
    const { seen, unsubscribe } = record();
    const before = seen.length;
    unsubscribe();
    openAnnouncementDetail("later");
    assert.equal(seen.length, before);
  });
});
