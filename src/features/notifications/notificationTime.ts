import type { NotificationItem, NotificationSection } from "./notification.types";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Single source of truth for notification timestamps across page and panel. */
export const formatNotificationTime = (
  item: Pick<NotificationItem, "createdAt" | "time">,
  now: number = Date.now()
): string => {
  const date = parseDate(item.createdAt);
  if (!date) return item.time ?? "";

  const elapsed = now - date.getTime();
  if (elapsed < MINUTE) return "Just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} min ago`;
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const dayGap = Math.round((startOfDay(new Date(now)) - startOfDay(date)) / DAY);
  if (dayGap === 1) return "Yesterday";
  if (dayGap < 7) return `${dayGap} days ago`;

  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? null : { year: "numeric" }),
  });
};

const GROUP_ORDER = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This week" },
  { key: "earlier", label: "Earlier" },
] as const;

const groupKeyFor = (item: NotificationItem, now: number): (typeof GROUP_ORDER)[number]["key"] => {
  const date = parseDate(item.createdAt);
  if (!date) return "earlier";

  const dayGap = Math.round((startOfDay(new Date(now)) - startOfDay(date)) / DAY);
  if (dayGap <= 0) return "today";
  if (dayGap === 1) return "yesterday";
  if (dayGap < 7) return "week";
  return "earlier";
};

/** Groups an already date-sorted list into Today / Yesterday / This week / Earlier. */
export const groupNotifications = (
  items: NotificationItem[],
  now: number = Date.now()
): NotificationSection[] => {
  const buckets = new Map<string, NotificationItem[]>();

  for (const item of items) {
    const key = groupKeyFor(item, now);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }

  return GROUP_ORDER.flatMap(({ key, label }) => {
    const bucket = buckets.get(key);
    return bucket?.length ? [{ key, label, items: bucket }] : [];
  });
};
