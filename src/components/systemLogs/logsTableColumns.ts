/**
 * Desktop table geometry for System Logs.
 *
 * Mirrors `usersTableColumns`: the checkbox is fixed in pixels, the rest are
 * flex weights taken from the columns' content proportions, so the table
 * stretches to fill whatever width the left column gives it rather than sitting
 * at a fixed size. Shared by the header and the rows so the two cannot drift.
 */
export const LOG_COLUMNS = {
  checkbox: 48,
  timestamp: 1.55,
  user: 1.6,
  role: 1.25,
  action: 1.9,
  module: 1.25,
  severity: 1.05,
  ip: 1.25,
  status: 1,
} as const;

/**
 * Below this the nine columns cramp, so the table keeps its proportions and
 * scrolls sideways instead.
 *
 * Lower than User Management's 1180 because these columns carry shorter values
 * — a timestamp, an IP and three pills rather than names, emails and addresses.
 * The logs table also lives in the 76% left column beside the details panel,
 * so it has less room to work with at the same window width.
 */
export const LOGS_TABLE_MIN_WIDTH = 1080;
