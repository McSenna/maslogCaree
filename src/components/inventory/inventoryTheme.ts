import { useMemo } from "react";
import type { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { BadgeTone } from "@/components/users/usersTheme";
import type { InventoryCategory, StockStatus } from "@/services/inventoryService";

/**
 * Colours for Inventory Management.
 *
 * Built on the same admin dashboard palette as User Management and System Logs
 * rather than a fourth one: the admin area is specified against a cool
 * near-white page with blue-tinted borders, and a screen assembled from
 * Tailwind's neutral greys reads as a foreign page dropped into the shell.
 * Only the inventory-specific tints are added here.
 */

/** The badge shown in the Status column, once expiry and stock are reconciled. */
export type DisplayStatus = StockStatus | "expiring-soon" | "expired";

const CATEGORY_TONES_LIGHT: Record<InventoryCategory, BadgeTone> = {
  medicine: { label: "Medicine", text: "#1D4ED8", bg: "#E5F0FF" },
  vaccine: { label: "Vaccine", text: "#15803D", bg: "#DCFCE7" },
  supply: { label: "Supply", text: "#7E22CE", bg: "#F3E8FF" },
  equipment: { label: "Equipment", text: "#0E7490", bg: "#CFFAFE" },
  maternal: { label: "Maternal Health", text: "#BE185D", bg: "#FCE7F3" },
  other: { label: "Other", text: "#475569", bg: "#EEF2F7" },
};

const CATEGORY_TONES_DARK: Record<InventoryCategory, BadgeTone> = {
  medicine: { label: "Medicine", text: "#93C5FD", bg: "rgba(37,99,235,0.18)" },
  vaccine: { label: "Vaccine", text: "#86EFAC", bg: "rgba(21,128,61,0.20)" },
  supply: { label: "Supply", text: "#D8B4FE", bg: "rgba(126,34,206,0.22)" },
  equipment: { label: "Equipment", text: "#67E8F9", bg: "rgba(14,116,144,0.22)" },
  maternal: { label: "Maternal Health", text: "#F9A8D4", bg: "rgba(190,24,93,0.20)" },
  other: { label: "Other", text: "#CBD5E1", bg: "rgba(71,85,105,0.22)" },
};

const STATUS_TONES_LIGHT: Record<DisplayStatus, BadgeTone> = {
  "in-stock": { label: "In Stock", text: "#15803D", bg: "#DCFCE7", dot: "#22C55E" },
  "low-stock": { label: "Low Stock", text: "#B45309", bg: "#FEF3C7", dot: "#F59E0B" },
  "out-of-stock": { label: "Out of Stock", text: "#BE123C", bg: "#FFE4E6", dot: "#F43F5E" },
  "expiring-soon": { label: "Expiring Soon", text: "#C2410C", bg: "#FFEDD5", dot: "#F97316" },
  expired: { label: "Expired", text: "#991B1B", bg: "#FEE2E2", dot: "#DC2626" },
};

const STATUS_TONES_DARK: Record<DisplayStatus, BadgeTone> = {
  "in-stock": { label: "In Stock", text: "#86EFAC", bg: "rgba(34,197,94,0.16)", dot: "#34D399" },
  "low-stock": { label: "Low Stock", text: "#FCD34D", bg: "rgba(245,158,11,0.16)", dot: "#FBBF24" },
  "out-of-stock": { label: "Out of Stock", text: "#FDA4AF", bg: "rgba(244,63,94,0.16)", dot: "#FB7185" },
  "expiring-soon": { label: "Expiring Soon", text: "#FDBA74", bg: "rgba(249,115,22,0.18)", dot: "#FB923C" },
  expired: { label: "Expired", text: "#FCA5A5", bg: "rgba(220,38,38,0.18)", dot: "#F87171" },
};

export type InventoryMetricKey = "total" | "inStock" | "lowStock" | "expiringSoon";

export type MetricTone = { iconBg: string; icon: string };

const METRIC_TONES_LIGHT: Record<InventoryMetricKey, MetricTone> = {
  total: { iconBg: "#DBEAFE", icon: "#2563EB" },
  inStock: { iconBg: "#DCFCE7", icon: "#16A34A" },
  lowStock: { iconBg: "#FEF3C7", icon: "#F59E0B" },
  expiringSoon: { iconBg: "#FEE2E2", icon: "#EF4444" },
};

const METRIC_TONES_DARK: Record<InventoryMetricKey, MetricTone> = {
  total: { iconBg: "rgba(37,99,235,0.20)", icon: "#60A5FA" },
  inStock: { iconBg: "rgba(22,163,74,0.20)", icon: "#34D399" },
  lowStock: { iconBg: "rgba(245,158,11,0.20)", icon: "#FBBF24" },
  expiringSoon: { iconBg: "rgba(239,68,68,0.20)", icon: "#F87171" },
};

/**
 * Metric card icons, matching the design: a box for the catalogue, a filled box
 * for what is available, a warning triangle for the reorder threshold and a
 * "no entry" glyph for stock going out of date.
 */
export const METRIC_ICONS: Record<InventoryMetricKey, keyof typeof Feather.glyphMap> = {
  total: "box",
  inStock: "package",
  lowStock: "alert-triangle",
  expiringSoon: "slash",
};

/** One icon per category, so a row is scannable before its badge is read. */
export const CATEGORY_ICONS: Record<
  InventoryCategory,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  medicine: "pill",
  vaccine: "needle",
  supply: "medical-bag",
  equipment: "monitor-dashboard",
  maternal: "mother-heart",
  other: "package-variant-closed",
};

const TREND_TONES_LIGHT = {
  up: { text: "#15803D", bg: "#DCFCE7" },
  down: { text: "#BE123C", bg: "#FFE4E6" },
} as const;

const TREND_TONES_DARK = {
  up: { text: "#86EFAC", bg: "rgba(34,197,94,0.16)" },
  down: { text: "#FDA4AF", bg: "rgba(244,63,94,0.16)" },
} as const;

export type InventoryPalette = ReturnType<typeof useInventoryPalette>;

export function useInventoryPalette() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const base = getAdminDashboardPalette(resolvedTheme);
    const isDark = resolvedTheme === "dark";

    return {
      ...base,
      subtleSurface: isDark ? "#111C33" : "#F8FBFF",
      /** Selected / hovered row — one step off the card, never a grey. */
      rowSelected: base.bannerBg,
      controlBorder: isDark ? "#334155" : "#CBD5E1",
      /** The amber expiry banner inside the details panel. */
      warningBg: isDark ? "rgba(245,158,11,0.14)" : "#FEF6E7",
      warningBorder: isDark ? "rgba(245,158,11,0.32)" : "#FCE4B6",
      warningText: isDark ? "#FCD34D" : "#B45309",
      /** Expiry dates in the table that are past or nearly past. */
      danger: isDark ? "#F87171" : "#DC2626",
      categories: isDark ? CATEGORY_TONES_DARK : CATEGORY_TONES_LIGHT,
      statuses: isDark ? STATUS_TONES_DARK : STATUS_TONES_LIGHT,
      metrics: isDark ? METRIC_TONES_DARK : METRIC_TONES_LIGHT,
      trends: isDark ? TREND_TONES_DARK : TREND_TONES_LIGHT,
      isDark,
    };
  }, [resolvedTheme]);
}

// Geometry is shared with User Management deliberately: the two admin tables
// sit under the same shell and any drift between them is visible.
export { CARD_SHADOW, CONTROL_HEIGHT, RADIUS } from "@/components/users/usersTheme";

const SHORT_DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/**
 * "Dec 15, 2026" — the form the design uses in the table and on the cards.
 *
 * The shared `formatDate` is long-form ("December 15, 2026") and is what the
 * details panel and other screens use; a full month name does not fit the
 * Expiry column at the width the table is specified at.
 */
export function formatShortDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, SHORT_DATE_OPTS);
}
