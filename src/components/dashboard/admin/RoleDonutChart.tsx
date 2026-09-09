import { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { ROLE_COLORS } from "@/design/adminDashboardTheme";
import type { RoleDistributionEntry } from "@/services/adminDashboardService";
import EmptyPanelState from "./EmptyPanelState";

type RoleDonutChartProps = {
  palette: AdminDashboardPalette;
  distribution: RoleDistributionEntry[];
  /** Stack the legend under the centred chart instead of beside it. */
  stacked?: boolean;
  size?: number;
};

/**
 * Ring thickness as a share of the diameter, so the donut keeps the same
 * proportions at every size instead of looking thin as it grows. At 180px it
 * gives a ~90 outer / ~60 inner radius, which leaves the centre statistic room
 * to breathe.
 */
const STROKE_RATIO = 1 / 6;
/** Arc length removed from every segment so neighbours read as separate bands. */
const GAP = 3;

export default function RoleDonutChart({
  palette,
  distribution,
  stacked = false,
  size = 168,
}: RoleDonutChartProps) {
  const horizontal = !stacked;
  const total = useMemo(
    () => distribution.reduce((sum, entry) => sum + (entry.count || 0), 0),
    [distribution]
  );

  const stroke = Math.round(size * STROKE_RATIO);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  /**
   * Segments are drawn as one circle per role with a dash pattern: the visible
   * dash is that role's share of the circumference, and the offset walks around
   * the ring. Cheaper and sharper than building arc paths, and it degrades to a
   * plain ring when a single role holds everything.
   *
   * A dash pattern starts at 3 o'clock, so every offset carries a quarter turn
   * to put the first segment at the top. Doing it in the offset rather than
   * with an SVG rotation keeps the markup free of transforms, which react-dom
   * rejects on web.
   */
  const segments = useMemo(() => {
    if (total <= 0) return [];
    let offset = 0;
    return distribution
      .filter((entry) => entry.count > 0)
      .map((entry) => {
        const fraction = entry.count / total;
        const length = Math.max(fraction * circumference - GAP, 1);
        const segment = {
          role: entry.role,
          color: ROLE_COLORS[entry.role] ?? palette.primary,
          dash: `${length} ${circumference - length}`,
          offset: circumference / 4 - offset,
        };
        offset += fraction * circumference;
        return segment;
      });
  }, [circumference, distribution, palette.primary, total]);

  if (total <= 0) {
    return (
      <EmptyPanelState
        palette={palette}
        icon="pie-chart"
        message="No user distribution data available."
      />
    );
  }

  const chart = (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.divider}
          strokeWidth={stroke}
          fill="none"
        />
        {segments.map((segment) => (
          <Circle
            key={segment.role}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={segment.color}
            strokeWidth={stroke}
            strokeDasharray={segment.dash}
            strokeDashoffset={segment.offset}
            strokeLinecap="butt"
            fill="none"
          />
        ))}
      </Svg>

      {/* Centred by the parent's items-center/justify-center rather than by
          coordinates, so it stays put at any donut size. */}
      <View className="absolute items-center">
        <Text className="text-[28px] font-bold" style={{ color: palette.heading, lineHeight: 34 }}>
          {total.toLocaleString()}
        </Text>
        <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
          Total Users
        </Text>
      </View>
    </View>
  );

  const legend = (
    <View className={horizontal ? "min-w-0 flex-1 gap-3" : "w-full gap-3"}>
      {distribution.map((entry) => {
        const percent = total > 0 ? Math.round((entry.count / total) * 100) : 0;
        return (
          <View key={entry.role} className="flex-row items-center gap-2">
            <View
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: ROLE_COLORS[entry.role] ?? palette.primary }}
            />
            <Text
              className="min-w-0 flex-1 text-[13px] font-medium"
              numberOfLines={1}
              style={{ color: palette.body }}
            >
              {entry.label}
            </Text>
            <Text className="text-[13px] font-semibold" style={{ color: palette.heading }}>
              {entry.count}{" "}
              <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
                ({percent}%)
              </Text>
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <View className={horizontal ? "flex-row items-center gap-4" : "items-center gap-4"}>
      {chart}
      {legend}
    </View>
  );
}
