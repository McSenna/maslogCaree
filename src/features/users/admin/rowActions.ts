/** Which actions a row offers, and how they read. Import-free so `node --test` can load it. */
import type { RowActionKey, User } from "./userAdmin.types.ts";

export const ROW_ACTION_ITEMS = {
  edit: { label: "Edit account", icon: "edit-2", danger: false },
  approve: { label: "Approve request", icon: "check-circle", danger: false },
  reject: { label: "Reject request", icon: "x-circle", danger: true },
  deactivate: { label: "Deactivate account", icon: "power", danger: true },
  reactivate: { label: "Reactivate account", icon: "rotate-ccw", danger: false },
  resetPassword: { label: "Send password reset", icon: "lock", danger: false },
  allowWeb: { label: "Allow web access", icon: "globe", danger: false },
  blockWeb: { label: "Block web access", icon: "slash", danger: true },
} as const satisfies Record<RowActionKey, { label: string; icon: string; danger: boolean }>;

/** The server refuses all of these when they do not apply; this only hides what would fail. */
export const rowActions = (user: User, selfId: string | number | null): RowActionKey[] => {
  if (user.status === "requested") return ["approve", "reject"];
  if (user.status === "rejected") return ["approve"];
  if (user.id === selfId) return ["edit"];
  if (user.status === "deactivated") return ["edit", "reactivate"];

  const actions: RowActionKey[] = ["edit", "deactivate", "resetPassword"];
  if (user.role === "Resident") actions.push(user.portalAccess.web ? "blockWeb" : "allowWeb");
  return actions;
};
