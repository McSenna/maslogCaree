import {
  DISABLED_STATUSES,
  SIGN_IN_READY_STATUSES,
  type AdminUser,
} from "@/features/users/services/userService";
import { parseToDate } from "@/utils/dateFormatter";

export type UserMetric = {
  value: number;
  growth: number | null;
};

export type UserMetrics = {
  total: UserMetric;
  active: UserMetric;
  new: UserMetric;
  suspended: UserMetric;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const percentChange = (current: number, previous: number): number | null => {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};

export const computeUserMetrics = (users: AdminUser[], now: Date = new Date()): UserMetrics => {
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
    const isSuspended = DISABLED_STATUSES.includes(user.status);
    const isActive = SIGN_IN_READY_STATUSES.includes(user.status);

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
};
