import { Animated, Platform, Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardRole } from "@/services/adminDashboardService";

import ChartTooltip from "../ChartTooltip";
import { DIMMED_OPACITY, HOTSPOT_SIZE, type DonutSegment } from "./donutSegments";
import type { RoleFilter } from "./donutSegments.types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  segments: DonutSegment[];
  geometry: { stroke: number; radius: number; center: number };
  palette: AdminDashboardPalette;
  activeRole: RoleFilter;
  pressedRole: DashboardRole | null;
  progress: Animated.Value;
  centerCount: number;
  centerLabel: string;
  centerLabelColor: string;
  pressedEntry: DonutSegment | null;
  onShowTooltip: (role: DashboardRole) => void;
  onHideTooltip: () => void;
};

const DonutRings = ({
  size,
  segments,
  geometry,
  palette,
  activeRole,
  pressedRole,
  progress,
  centerCount,
  centerLabel,
  centerLabelColor,
  pressedEntry,
  onShowTooltip,
  onHideTooltip,
}: Props) => {
  const { stroke, radius, center } = geometry;
  const countFontSize = Math.round(size * 0.2);
  const labelFontSize = Math.max(11, Math.round(size * 0.072));

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        {segments.map((segment) =>
          segment.role === pressedRole ? (
            <Circle
              key={`glow-${segment.role}`}
              cx={center}
              cy={center}
              r={radius}
              stroke={segment.color}
              strokeWidth={stroke + 8}
              strokeDasharray={segment.dash}
              strokeDashoffset={segment.offset}
              strokeLinecap="butt"
              strokeOpacity={0.22}
              fill="none"
            />
          ) : null
        )}

        {segments.map((segment) => {
          const isDimmed = activeRole !== "all" && segment.role !== activeRole;
          return (
            <AnimatedCircle
              key={segment.role}
              cx={center}
              cy={center}
              r={radius}
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={segment.dash}
              strokeDashoffset={segment.offset}
              strokeLinecap="butt"
              strokeOpacity={isDimmed ? DIMMED_OPACITY : progress}
              fill="none"
            />
          );
        })}
      </Svg>

      {segments.map((segment) => (
        <Pressable
          key={`hotspot-${segment.role}`}
          accessibilityRole="button"
          accessibilityLabel={`${segment.label}: ${segment.count} ${segment.count === 1 ? "user" : "users"}, ${segment.percent} percent`}
          hitSlop={8}
          onPressIn={() => onShowTooltip(segment.role)}
          onPressOut={onHideTooltip}
          onHoverIn={() => onShowTooltip(segment.role)}
          onHoverOut={onHideTooltip}
          onFocus={() => onShowTooltip(segment.role)}
          onBlur={onHideTooltip}
          style={{
            position: "absolute",
            left: segment.hotspot.x - HOTSPOT_SIZE / 2,
            top: segment.hotspot.y - HOTSPOT_SIZE / 2,
            width: HOTSPOT_SIZE,
            height: HOTSPOT_SIZE,
            borderRadius: HOTSPOT_SIZE / 2,
            ...Platform.select({ web: { cursor: "pointer" } as any }),
          }}
        />
      ))}

      <View className="absolute items-center" style={{ pointerEvents: "none" }}>
        <Text
          className="font-bold tabular-nums"
          style={{
            color: palette.heading,
            fontSize: countFontSize,
            lineHeight: Math.round(countFontSize * 1.15),
          }}
        >
          {centerCount.toLocaleString()}
        </Text>
        <Text
          className="mt-0.5 font-medium"
          numberOfLines={1}
          style={{ color: centerLabelColor, fontSize: labelFontSize }}
        >
          {centerLabel}
        </Text>
      </View>

      {pressedEntry ? (
        <ChartTooltip
          title={pressedEntry.label}
          meta={`${pressedEntry.count} ${pressedEntry.count === 1 ? "user" : "users"} · ${pressedEntry.percent}%`}
          x={pressedEntry.hotspot.x}
          y={pressedEntry.hotspot.y}
          containerWidth={size}
        />
      ) : null}
    </View>
  );
};

export default DonutRings;
