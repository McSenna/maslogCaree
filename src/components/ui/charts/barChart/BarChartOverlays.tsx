import { Platform, Pressable, Text, View } from "react-native";

import { barHeight, TICKS, type BarLayout } from "./barChartLayout";
import type { SimpleBarDatum } from "./barChartTypes";

type SharedProps = {
  data: SimpleBarDatum[];
  layout: BarLayout;
  peakIdx: number;
  accentColor: string;
  tickColor: string;
};

const centeredLabel = (layout: BarLayout, index: number) => ({
  position: "absolute" as const,
  left: layout.slotCenter(index) - layout.slot / 2,
  width: layout.slot,
  textAlign: "center" as const,
  fontSize: 11,
});

export const BarChartYAxis = ({
  layout,
  axisMax,
  tickColor,
}: {
  layout: BarLayout;
  axisMax: number;
  tickColor: string;
}) => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: layout.padLeft - 4,
      height: layout.axisY,
    }}
  >
    {Array.from({ length: TICKS + 1 }, (_, t) => t / TICKS).map((t) => (
      <Text
        key={t}
        numberOfLines={1}
        style={{
          position: "absolute",
          top: layout.padTop + layout.innerH * (1 - t) - 6,
          left: 0,
          right: 0,
          textAlign: "right",
          fontSize: 11,
          color: tickColor,
          fontVariant: ["tabular-nums"],
        }}
      >
        {Math.round(axisMax * t)}
      </Text>
    ))}
  </View>
);

/** Each bar's value, printed just above the bar. */
export const BarChartValues = ({
  data,
  layout,
  peakIdx,
  accentColor,
  tickColor,
  axisMax,
  valueColor,
}: SharedProps & { axisMax: number; valueColor: string }) => (
  <View
    style={{ position: "absolute", top: 0, left: 0, right: 0, height: layout.axisY }}
    pointerEvents="none"
  >
    {data.map((d, i) => {
      const value = Number.isFinite(d.value) ? d.value : 0;
      const top = layout.axisY - barHeight(value, axisMax, layout.innerH) - 17;
      return (
        <Text
          key={`value-${i}`}
          numberOfLines={1}
          style={{
            ...centeredLabel(layout, i),
            top,
            fontSize: 12,
            fontWeight: i === peakIdx ? "800" : "700",
            color: i === peakIdx ? accentColor : d.partial ? tickColor : valueColor,
            fontVariant: ["tabular-nums"],
          }}
        >
          {value.toLocaleString()}
        </Text>
      );
    })}
  </View>
);

export const BarChartLabels = ({
  data,
  layout,
  peakIdx,
  accentColor,
  tickColor,
}: SharedProps) => (
  <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: layout.padBottom }}>
    {data.map((d, i) => (
      <Text
        key={`label-${i}`}
        numberOfLines={1}
        style={{
          ...centeredLabel(layout, i),
          fontWeight: i === peakIdx ? "600" : "400",
          color: i === peakIdx ? accentColor : tickColor,
        }}
      >
        {d.label}
      </Text>
    ))}
  </View>
);

export const BarChartHitAreas = ({
  data,
  layout,
  chartW,
  onActivate,
  onClear,
  describe,
}: {
  data: SimpleBarDatum[];
  layout: BarLayout;
  chartW: number;
  onActivate: (index: number) => void;
  onClear: () => void;
  /** Screen-reader name for bar `i`; defaults to "<label>: <value> events". */
  describe?: (index: number) => string;
}) => (
  <View style={{ position: "absolute", top: 0, left: 0, width: chartW, height: layout.axisY }}>
    {data.map((d, i) => (
      <Pressable
        key={`hit-${i}`}
        accessibilityRole="button"
        accessibilityLabel={
          describe ? describe(i) : `${d.label}: ${Number.isFinite(d.value) ? d.value : 0} events`
        }
        onPressIn={() => onActivate(i)}
        onPressOut={onClear}
        onHoverIn={() => onActivate(i)}
        onHoverOut={onClear}
        onFocus={() => onActivate(i)}
        onBlur={onClear}
        style={{
          position: "absolute",
          left: layout.padLeft + layout.slot * i,
          top: 0,
          width: layout.slot,
          height: layout.axisY,
          ...Platform.select({ web: { cursor: "pointer" } }),
        }}
      />
    ))}
  </View>
);
