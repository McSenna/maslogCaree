import { useMemo } from "react";
import type { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { BadgeTone } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { InventoryCategory, StockStatus } from "@/features/inventory/services/inventoryService";

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

export const METRIC_ICONS: Record<InventoryMetricKey, keyof typeof Feather.glyphMap> = {
  total: "box",
  inStock: "package",
  lowStock: "alert-triangle",
  expiringSoon: "slash",
};

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

export const useInventoryPalette = () => {
  const surface = useAdminSurfacePalette();

  return useMemo(() => {
    const { isDark } = surface;

    return {
      ...surface,
      danger: isDark ? "#F87171" : "#DC2626",
      categories: isDark ? CATEGORY_TONES_DARK : CATEGORY_TONES_LIGHT,
      statuses: isDark ? STATUS_TONES_DARK : STATUS_TONES_LIGHT,
      metrics: isDark ? METRIC_TONES_DARK : METRIC_TONES_LIGHT,
      trends: isDark ? TREND_TONES_DARK : TREND_TONES_LIGHT,
    };
  }, [surface]);
};

export { CARD_SHADOW, CONTROL_HEIGHT, RADIUS } from "@/design/adminSurfaces";

const SHORT_DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const formatShortDate = (value: string | Date | null | undefined): string => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, SHORT_DATE_OPTS);
};
