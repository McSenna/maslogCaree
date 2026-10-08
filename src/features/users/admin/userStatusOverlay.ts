/**
 * Applies status changes that are being sent, or were just saved,
 * to the rows on screen. Import-free so `node --test` can load it.
 */
import type { StatusAction, User, UserStatus, UserTab } from "./userAdmin.types.ts";

export type PendingStatusChange = { ids: readonly string[]; action: StatusAction };

const statusAfter = (user: User, action: StatusAction): UserStatus => {
  if (action === "deactivate") return "deactivated";
  return user.role === "Resident" ? "approved" : "active";
};

/**
 * "All accounts" keeps every account, so the row stays and its status
 * changes. Every other tab only holds one side, so the row leaves the list.
 */
export const applyStatusChanges = (
  users: readonly User[],
  changes: readonly PendingStatusChange[],
  tab: UserTab
): User[] => {
  if (changes.length === 0) return [...users];

  if (tab === "accounts") {
    return users.map((user) => {
      const change = changes.find((candidate) => candidate.ids.includes(user.id));
      return change ? { ...user, status: statusAfter(user, change.action) } : user;
    });
  }

  const hidden = new Set(changes.flatMap((change) => change.ids));
  return users.filter((user) => !hidden.has(user.id));
};

/** "Ana Cruz deactivated." or "3 users reactivated." */
export const statusToastMessage = (names: readonly string[], action: StatusAction): string => {
  const verb = action === "deactivate" ? "deactivated" : "reactivated";
  return names.length === 1 ? `${names[0]} ${verb}.` : `${names.length} users ${verb}.`;
};
