import { useMemo } from "react";

import { ROLE_COLORS, type AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { calculatePercentage } from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { DashboardRole, RoleDistributionEntry } from "@/services/adminDashboardService";

export const STROKE_RATIO = 0.2;
export const GAP_RATIO = 0.18;
export const DIMMED_OPACITY = 0.22;
export const HOTSPOT_SIZE = 30;

export type DonutSegment = {
  role: DashboardRole;
  label: string;
  count: number;
  percent: number;
  color: string;
  dash: string;
  offset: number;
  hotspot: { x: number; y: number };
};

export const resolveDonutGeometry = (size: number) => {
  const stroke = Math.round(size * STROKE_RATIO);
  const radius = (size - stroke) / 2;
  return {
    stroke,
    radius,
    circumference: 2 * Math.PI * radius,
    center: size / 2,
    gap: Math.max(4, Math.round(stroke * GAP_RATIO)),
  };
};

type SegmentInput = {
  distribution: RoleDistributionEntry[];
  total: number;
  circumference: number;
  gap: number;
  center: number;
  radius: number;
  palette: AdminDashboardPalette;
};

export const useDonutSegments = ({
  distribution,
  total,
  circumference,
  gap,
  center,
  radius,
  palette,
}: SegmentInput): DonutSegment[] =>
  useMemo(() => {
    if (total <= 0) return [];
    let startFraction = 0;

    return distribution
      .filter((entry) => entry.count > 0)
      .map((entry) => {
        const fraction = entry.count / total;
        const length = Math.max(fraction * circumference - gap, 1);
        const midFraction = startFraction + fraction / 2;
        const angle = -Math.PI / 2 + midFraction * 2 * Math.PI;

        const segment: DonutSegment = {
          role: entry.role,
          label: entry.label,
          count: entry.count,
          percent: calculatePercentage(entry.count, total),
          color: ROLE_COLORS[entry.role] ?? palette.primary,
          dash: `${length} ${circumference - length}`,
          offset: circumference / 4 - startFraction * circumference,
          hotspot: {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
          },
        };
        startFraction += fraction;
        return segment;
      });
  }, [center, circumference, distribution, gap, palette.primary, radius, total]);
