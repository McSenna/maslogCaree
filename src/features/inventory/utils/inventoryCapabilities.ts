import type { InventoryPermissions } from "../types/inventory.types";

export type InventoryCapability =
  | "inventory.view"
  | "inventory.create"
  | "inventory.edit"
  | "inventory.add_stock"
  | "inventory.release_stock"
  | "inventory.view_history"
  | "inventory.archive";

const CAPABILITY_FIELDS: Record<InventoryCapability, keyof InventoryPermissions> = {
  "inventory.view": "view",
  "inventory.create": "create",
  "inventory.edit": "edit",
  "inventory.add_stock": "stockIn",
  "inventory.release_stock": "stockOut",
  "inventory.view_history": "history",
  "inventory.archive": "deactivate",
};

export const can = (
  permissions: InventoryPermissions | null | undefined,
  capability: InventoryCapability
): boolean => {
  if (!permissions) return false;
  return Boolean(permissions[CAPABILITY_FIELDS[capability]]);
};
