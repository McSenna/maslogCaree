import { useMemo } from "react";
import type { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { statusBadge, toneBadge, type BadgeTone } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { InventoryCategory, StockStatus } from "@/features/inventory/services/inventoryService";

export type DisplayStatus = StockStatus | "expiring-soon" | "expired";

export type InventoryMetricKey = "total" | "inStock" | "lowStock" | "expiringSoon";

export type MetricTone = { iconBg: string; icon: string };

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

export type InventoryPalette = ReturnType<typeof useInventoryPalette>;

export const useInventoryPalette = () => {
  const surface = useAdminSurfacePalette();

  return useMemo(() => {
    const { tones, statusTones } = surface;

    return {
      ...surface,
      danger: statusTones.danger.fg,
      // Medicine keeps the semantic info blue; vaccines and maternal health are
      // healthcare (care green); the rest stay neutral so the table stays calm.
      categories: {
        medicine: toneBadge("Medicine", tones.primary),
        vaccine: toneBadge("Vaccine", tones.care),
        supply: toneBadge("Supply", tones.neutral),
        equipment: toneBadge("Equipment", tones.neutral),
        maternal: toneBadge("Maternal Health", tones.care),
        other: toneBadge("Other", tones.neutral),
      } satisfies Record<InventoryCategory, BadgeTone>,
      statuses: {
        "in-stock": statusBadge("In Stock", statusTones.success, "check-circle"),
        "low-stock": statusBadge("Low Stock", statusTones.warning, "alert-triangle"),
        "out-of-stock": statusBadge("Out of Stock", statusTones.danger, "x-circle"),
        "expiring-soon": statusBadge("Expiring Soon", statusTones.warning, "clock"),
        expired: statusBadge("Expired", statusTones.danger, "alert-octagon"),
      } satisfies Record<DisplayStatus, BadgeTone>,
      metrics: {
        total: { iconBg: tones.primary.iconBg, icon: tones.primary.icon },
        inStock: { iconBg: tones.care.iconBg, icon: tones.care.icon },
        lowStock: { iconBg: tones.accent.iconBg, icon: tones.accent.icon },
        expiringSoon: { iconBg: tones.danger.iconBg, icon: tones.danger.icon },
      } satisfies Record<InventoryMetricKey, MetricTone>,
      trends: surface.trends,
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
  if (!value) return "Not set";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString(undefined, SHORT_DATE_OPTS);
};
