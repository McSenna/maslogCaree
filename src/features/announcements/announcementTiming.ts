// Kept import-free so `node --test` can load it without the `@/` alias.

export type EventTiming = { label: string; past: boolean } | null;

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/**
 * How far away an event is, in words a reader takes in at a glance:
 * "Today", "Tomorrow", "In 5 days", "In 3 weeks", or "Past event".
 * Counted in calendar days, so 11 PM tonight is still "Today".
 */
export const describeEventTiming = (iso: string, now: Date = new Date()): EventTiming => {
  const event = new Date(iso);
  if (Number.isNaN(event.getTime())) return null;
  if (event.getTime() < now.getTime()) return { label: "Past event", past: true };

  const days = Math.round((startOfDay(event) - startOfDay(now)) / DAY_MS);
  if (days <= 0) return { label: "Today", past: false };
  if (days === 1) return { label: "Tomorrow", past: false };
  if (days < 14) return { label: `In ${days} days`, past: false };
  if (days < 60) return { label: `In ${Math.round(days / 7)} weeks`, past: false };
  return null;
};

/** Upcoming soonest first, then past most recent first: the order staff act on them. */
export const groupAnnouncementsByTiming = <T extends { eventAt: string }>(
  items: readonly T[],
  now: Date = new Date()
): { upcoming: T[]; past: T[] } => {
  const time = (item: T) => new Date(item.eventAt).getTime() || 0;
  const upcoming = items.filter((item) => time(item) >= now.getTime()).sort((a, b) => time(a) - time(b));
  const past = items.filter((item) => time(item) < now.getTime()).sort((a, b) => time(b) - time(a));
  return { upcoming, past };
};
