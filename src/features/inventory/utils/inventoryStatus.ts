import type { InventoryItem, StockStatus } from "../types/inventory.types";

export const resolveDisplayStatus = (item: InventoryItem): StockStatus | "expiring-soon" | "expired" => {
  if (item.expiryStatus === "expired") return "expired";
  if (item.stockStatus === "out-of-stock") return "out-of-stock";
  if (item.expiryStatus === "expiring-soon" || item.expiryStatus === "urgent") return "expiring-soon";
  if (item.stockStatus === "low-stock") return "low-stock";
  return "in-stock";
};

export type DisplayStatusKey = StockStatus | "expiring-soon" | "expired";

export const resolveStatusBadges = (item: InventoryItem): DisplayStatusKey[] => {
  if (item.expiryStatus === "expired") return ["expired"];
  if (item.stockStatus === "out-of-stock") return ["out-of-stock"];

  const badges: DisplayStatusKey[] = [];
  if (item.stockStatus === "low-stock") badges.push("low-stock");
  if (item.expiryStatus === "expiring-soon" || item.expiryStatus === "urgent") {
    badges.push("expiring-soon");
  }
  return badges.length ? badges : ["in-stock"];
};
