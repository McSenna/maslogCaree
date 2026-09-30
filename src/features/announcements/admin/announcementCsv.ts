/**
 * CSV for "Export CSV". Import-free so `node --test` can load it.
 */
import type { Announcement } from "./adminAnnouncement.types.ts";
import { STATUS_LABELS, formatDay, statusOf } from "./adminAnnouncementModel.ts";

const HEADER = ["Title", "Audience", "Status", "Posted", "Posted by", "Expires", "Event", "Location", "Message"];

// Quotes every cell, and defuses a leading = + - @ so a spreadsheet never runs it as a formula.
const cell = (value: string): string => {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const buildAnnouncementsCsv = (items: readonly Announcement[], now: Date = new Date()): string => {
  const rows = items.map((item) => [
    item.title,
    item.audience,
    STATUS_LABELS[statusOf(item, now)],
    formatDay(item.createdAt),
    item.authorName ?? "",
    formatDay(item.expiresAt),
    formatDay(item.eventAt),
    item.location,
    item.body,
  ]);
  return [HEADER, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
};

/** "announcements-2026-09-30.csv" */
export const csvFileName = (now: Date = new Date()): string => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `announcements-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
};
