/**
 * Pure logic for the admin announcements screen: mapping, status, filtering and
 * counts. Import-free (type imports are erased) so `node --test` can load it.
 */
import type { AnnouncementRecord } from "../announcement.types.ts";
import type {
  Announcement,
  AudienceFilter,
  Status,
  StatusCounts,
  StatusFilter,
} from "./adminAnnouncement.types.ts";

/** The one place API field names become the screen's contract. */
export const toAdminAnnouncement = (record: AnnouncementRecord): Announcement => ({
  id: record.id,
  title: record.title,
  body: record.message,
  audience: record.audience ?? "Everyone",
  authorName: record.postedBy ?? null,
  createdAt: record.createdAt,
  expiresAt: record.expiresAt ?? null,
  isDraft: Boolean(record.isDraft),
  eventAt: record.eventAt,
  location: record.location,
});

export const statusOf = (item: Announcement, now: Date = new Date()): Status => {
  if (item.isDraft) return "draft";
  if (item.expiresAt && new Date(item.expiresAt).getTime() <= now.getTime()) return "expired";
  return "active";
};

export type AnnouncementFilters = {
  query: string;
  audience: AudienceFilter;
  status: StatusFilter;
};

export const EMPTY_FILTERS: AnnouncementFilters = { query: "", audience: "all", status: "all" };

export const hasActiveFilters = (filters: AnnouncementFilters): boolean =>
  filters.query.trim() !== "" || filters.audience !== "all" || filters.status !== "all";

export const filterAnnouncements = (
  items: readonly Announcement[],
  filters: AnnouncementFilters,
  now: Date = new Date()
): Announcement[] => {
  const needle = filters.query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (filters.audience === "all" || item.audience === filters.audience) &&
      (filters.status === "all" || statusOf(item, now) === filters.status) &&
      (!needle || `${item.title}\n${item.body}`.toLowerCase().includes(needle))
  );
};

/** Tab counts: every fetched item, ignoring search and audience. */
export const countByStatus = (items: readonly Announcement[], now: Date = new Date()): StatusCounts => {
  const counts: StatusCounts = { all: items.length, active: 0, draft: 0, expired: 0 };
  for (const item of items) counts[statusOf(item, now)] += 1;
  return counts;
};

const validDate = (iso: string | null): Date | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "22 Sep 2026": fixed day-month-year order, month name in the device language. */
export const formatDay = (iso: string | null): string => {
  const date = validDate(iso);
  if (!date) return "";
  const month = date.toLocaleDateString(undefined, { month: "short" });
  return `${String(date.getDate()).padStart(2, "0")} ${month} ${date.getFullYear()}`;
};

/** "30 Sep 2026, 10:44 AM" */
export const formatDayTime = (iso: string | null): string => {
  const date = validDate(iso);
  if (!date) return "";
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${formatDay(iso)}, ${time}`;
};

export const postedLine = (item: Announcement): string => {
  const day = formatDay(item.createdAt);
  const by = item.authorName ? ` by ${item.authorName}` : "";
  return day ? `Posted ${day}${by}` : `Posted${by}`;
};

/** Phone meta: "Until 22 Sep 2026", "Ended 22 Sep 2026" or "No expiry". */
export const expiryShort = (item: Announcement, now: Date = new Date()): string => {
  if (!item.expiresAt) return "No expiry";
  return statusOf(item, now) === "expired"
    ? `Ended ${formatDay(item.expiresAt)}`
    : `Until ${formatDay(item.expiresAt)}`;
};

/** Wide details: "Expires 22 Sep 2026", "Expired 22 Sep 2026" or "No expiry date". */
export const expiryLong = (item: Announcement, now: Date = new Date()): string => {
  if (!item.expiresAt) return "No expiry date";
  return statusOf(item, now) === "expired"
    ? `Expired ${formatDay(item.expiresAt)}`
    : `Expires ${formatDay(item.expiresAt)}`;
};

export const eventLine = (item: Announcement): string => {
  const date = validDate(item.eventAt);
  if (!date) return item.location;
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `Event on ${formatDay(item.eventAt)}, ${time}, at ${item.location}`;
};

/** "3 of 12 announcements" */
export const countLine = (visible: number, total: number): string =>
  `${visible} of ${total} ${total === 1 ? "announcement" : "announcements"}`;

export const STATUS_LABELS: Record<Status, string> = {
  active: "Active",
  draft: "Draft",
  expired: "Expired",
};

export const AUDIENCE_FILTER_LABELS: Record<AudienceFilter, string> = {
  all: "All audiences",
  Patients: "Patients",
  Staff: "Staff",
  Everyone: "Everyone",
};

export const AUDIENCE_FILTERS: readonly AudienceFilter[] = ["all", "Patients", "Staff", "Everyone"];
