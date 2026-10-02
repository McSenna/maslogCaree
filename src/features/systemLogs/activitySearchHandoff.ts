/**
 * Hands a search term to the System Logs screen without putting it in the
 * URL. "View activity" filters by a person's email or name, and RA 10173
 * keeps personal data out of URLs (browser history, server logs, shared links).
 *
 * In memory only: a refresh or a direct visit finds nothing here and opens the
 * unfiltered logs. Import-free so `node --test` can load it.
 */

let pending: string | null = null;

/** Called just before navigating to the System Logs screen. */
export const handOffActivitySearch = (term: string | null | undefined): void => {
  const trimmed = typeof term === "string" ? term.trim() : "";
  pending = trimmed || null;
};

/** The waiting term, or "" when the screen was opened any other way. */
export const peekActivitySearch = (): string => pending ?? "";

/** Read once: the next visit (sidebar, back, refresh) starts unfiltered. */
export const clearActivitySearch = (): void => {
  pending = null;
};
