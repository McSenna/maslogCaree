/**
 * The "Newest accounts" card: at most five accounts, newest first, and counts
 * that are real totals, not counts of the rows shown. Free of React so
 * `node --test` can load it.
 */

export const NEWEST_ACCOUNTS_LIMIT = 5;

export type AccountGroup = "all" | "residents" | "staff";

type Joined = { createdAt: string };
type RoleCount = { role: string; count: number };

const joinedAt = (account: Joined): number => {
  const time = Date.parse(account.createdAt);
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
};

/** Newest first (the server already sorts; this keeps the card right if it ever does not), capped at five. */
export const newestFirst = <T extends Joined>(accounts: readonly T[], limit = NEWEST_ACCOUNTS_LIMIT): T[] =>
  [...accounts].sort((a, b) => joinedAt(b) - joinedAt(a)).slice(0, limit);

/** All accounts, residents, and everyone else (staff), from the dashboard's own totals. */
export const groupTotals = (totalUsers: number, distribution: readonly RoleCount[]): Record<AccountGroup, number> => {
  const residents = distribution.find((entry) => entry.role === "resident")?.count ?? 0;
  return { all: totalUsers, residents, staff: Math.max(0, totalUsers - residents) };
};
