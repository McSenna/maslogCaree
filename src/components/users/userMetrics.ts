import type { AdminUser } from "@/services/userService";
import { parseToDate } from "@/utils/dateFormatter";

export type UserMetric = {
  value: number;
  /**
   * Percentage change against a month ago, or null when there is no baseline
   * to divide by — the pill is dropped rather than showing a fake figure.
   */
  growth: number | null;
};

export type UserMetrics = {
  total: UserMetric;
  active: UserMetric;
  new: UserMetric;
  suspended: UserMetric;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Derives the four summary figures from the user list the page already has.
 *
 * The server exposes no historical snapshots, so a trend is computed the only
 * way the data honestly supports: the "a month ago" baseline for a bucket is
 * the number of accounts in that same bucket that already existed 30 days ago.
 * That measures growth attributable to new registrations — the dominant driver
 * — and never invents a status history the records do not carry. Where the
 * baseline is zero the trend is null and the card simply omits its pill.
 */
export function computeUserMetrics(users: AdminUser[], now: Date = new Date()): UserMetrics {
  const monthAgo = now.getTime() - 30 * DAY_MS;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  let total = 0;
  let active = 0;
  let suspended = 0;
  let totalBefore = 0;
  let activeBefore = 0;
  let suspendedBefore = 0;
  let newThisMonth = 0;
  let newLastMonth = 0;

  for (const user of users) {
    const createdAt = parseToDate(user.createdAt).getTime();
    const existedAMonthAgo = createdAt < monthAgo;
    // "Suspended Users" is the card's label; the figure covers every account an
    // administrator has barred, which is both `suspended` and `inactive`.
    const isSuspended = user.status === "suspended" || user.status === "inactive";
    const isActive = user.status === "active";

    total += 1;
    if (isActive) active += 1;
    if (isSuspended) suspended += 1;

    if (existedAMonthAgo) {
      totalBefore += 1;
      if (isActive) activeBefore += 1;
      if (isSuspended) suspendedBefore += 1;
    }

    if (createdAt >= monthStart) newThisMonth += 1;
    else if (createdAt >= previousMonthStart) newLastMonth += 1;
  }

  return {
    total: { value: total, growth: percentChange(total, totalBefore) },
    active: { value: active, growth: percentChange(active, activeBefore) },
    new: { value: newThisMonth, growth: percentChange(newThisMonth, newLastMonth) },
    suspended: { value: suspended, growth: percentChange(suspended, suspendedBefore) },
  };
}
