/**
 * CSV for "Export CSV": the rows on screen, so the file matches the current
 * tab, search and filters. Import-free so `node --test` can load it.
 */
import type { User } from "./userAdmin.types.ts";
import { ACCESS_LABELS, STATUS_LABELS } from "./userAdminModel.ts";
import { formatDate, formatTime } from "./userDates.ts";

const HEADER = ["Name", "Email", "Role", "Access", "Location", "Status", "Last login", "Added"];

// Quotes every cell, and defuses a leading = + - @ so a spreadsheet never runs it as a formula.
const cell = (value: string): string => {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

const lastLogin = (iso: string | null): string => (iso ? `${formatDate(iso)} ${formatTime(iso)}` : "Never");

export const buildUsersCsv = (users: readonly User[]): string => {
  const rows = users.map((user) => [
    user.fullName,
    user.email,
    user.role,
    ACCESS_LABELS[user.access],
    user.location,
    STATUS_LABELS[user.status],
    lastLogin(user.lastLoginAt),
    formatDate(user.createdAt),
  ]);
  return [HEADER, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
};

/** "users-2026-10-02.csv" */
export const usersCsvFileName = (now: Date = new Date()): string => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `users-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
};
