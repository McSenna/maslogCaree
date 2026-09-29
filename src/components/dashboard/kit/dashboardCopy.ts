/**
 * Plain-text helpers for dashboard headers. Import-free so `node --test` can load them directly.
 */

const TITLES = new Set(["dr", "dra", "doc", "nurse", "mw", "hon"]);

export const greetingFor = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

/**
 * The name to greet someone by: the first name, or "Dr. Rizal" when the full name starts with a title,
 * because "Good morning, Dr." or "Good morning, Jose" would both read oddly for a doctor.
 */
export const greetingName = (fullName: string | null | undefined): string => {
  const words = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "";

  const first = words[0];
  const bare = first.replace(/\.$/, "").toLowerCase();
  if (TITLES.has(bare) && words.length > 1) {
    const title = first.endsWith(".") ? first : `${first}.`;
    return `${title} ${words[words.length - 1]}`;
  }
  return first;
};

export const greetingLine = (fullName: string | null | undefined, date: Date = new Date()): string => {
  const name = greetingName(fullName);
  return name ? `${greetingFor(date)}, ${name}` : greetingFor(date);
};

/** "Tuesday, September 29" */
export const longDate = (date: Date = new Date()): string =>
  date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

/**
 * "Updated just now", "Updated 4 min ago", or "Updated at 9:40 AM" once it is over an hour old.
 * Returns "" for a timestamp that can't be read.
 */
export const updatedLabel = (iso: string | null | undefined, now: Date = new Date()): string => {
  if (!iso) return "";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";

  const minutes = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  return `Updated at ${then.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
};

export const plural = (count: number, one: string, many = `${one}s`): string =>
  `${count.toLocaleString()} ${count === 1 ? one : many}`;

/** Joins non-empty clauses into one sentence: ["3 waiting", "", "1 urgent"] → "3 waiting and 1 urgent". */
export const joinClauses = (clauses: (string | null | undefined | false)[]): string => {
  const parts = clauses.filter((part): part is string => Boolean(part));
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
};
