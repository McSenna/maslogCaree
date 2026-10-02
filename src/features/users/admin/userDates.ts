/** Date lines for the Users screen. Import-free so `node --test` can load it. */

const validDate = (iso: string | null): Date | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

const shortMonth = (date: Date): string => date.toLocaleDateString(undefined, { month: "short" });

/** "Sep 20, 2026", month name in the device language. */
export const formatDate = (iso: string | null): string => {
  const date = validDate(iso);
  return date ? `${shortMonth(date)} ${date.getDate()}, ${date.getFullYear()}` : "";
};

/** "8:05 AM" */
export const formatTime = (iso: string | null): string => {
  const date = validDate(iso);
  return date ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "";
};

/** Date over time, or "Never" with no time line when the user has not signed in. */
export const lastLoginLines = (iso: string | null): { date: string; time: string } => {
  const date = formatDate(iso);
  return date ? { date, time: formatTime(iso) } : { date: "Never", time: "" };
};

/** "Since 1 Oct 2026": the start of the current month. */
export const monthStartNote = (now: Date = new Date()): string =>
  `Since 1 ${shortMonth(now)} ${now.getFullYear()}`;
