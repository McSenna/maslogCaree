import { useMemo, useState } from "react";
import { LayoutChangeEvent, View, Text } from "react-native";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

export type SimpleBarDatum = {
  label: string;
  value: number;
  color?: string;
};

type SimpleBarChartProps = {
  data: SimpleBarDatum[];
  height?: number;
  radius?: number;
  showLabels?: boolean;
  showValues?: boolean;
  accentColor?: string;
  dimColor?: string;
};

const PAD_X = 8;
/** Widest a single bar gets, however much room the card gives it. */
const MAX_BAR_W = 34;

export default function SimpleBarChart({
  data,
  height = 140,
  radius = 6,
  showLabels = true,
  showValues = false,
  accentColor = "#378ADD",
  dimColor = "#B5D4F4",
}: SimpleBarChartProps) {
  /**
   * Measured rather than drawn into a bar-count-derived viewBox: with
   * width="100%" and a fixed viewBox, SVG scales the drawing to fit and
   * centres it, so a 7-bar chart renders ~200px wide in the middle of a wide
   * card. Laying the bars out across the measured width keeps the chart
   * aligned with the card and with its own labels.
   */
  const [chartW, setChartW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const next = Math.round(e.nativeEvent.layout.width);
    if (next > 0 && next !== chartW) setChartW(next);
  };

  const max = useMemo(
    () => Math.max(1, ...data.map((d) => (Number.isFinite(d.value) ? d.value : 0))),
    [data]
  );

  const peakIdx = useMemo(
    () => data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0),
    [data]
  );

  const PAD_TOP = showValues ? 18 : 8;
  const PAD_BOTTOM = showLabels ? 20 : 8;
  const innerH = height - PAD_TOP - PAD_BOTTOM;
  const innerW = Math.max(0, chartW - PAD_X * 2);

  // One evenly divided slot per bar; the bar is centred inside its slot, so
  // bars and labels share the same centres by construction.
  const slot = data.length > 0 ? innerW / data.length : 0;
  const barW = Math.min(MAX_BAR_W, Math.max(6, slot * 0.55));
  const slotCenter = (i: number) => PAD_X + slot * i + slot / 2;

  const measured = chartW > 0 && innerW > 0 && data.length > 0;

  return (
    <View onLayout={onLayout} style={{ width: "100%", height }}>
      {measured ? (
        <>
          <Svg width={chartW} height={height}>
            <Defs>
              <LinearGradient id="barGradientAccent" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={accentColor} stopOpacity={1} />
                <Stop offset="100%" stopColor={accentColor} stopOpacity={0.7} />
              </LinearGradient>
              <LinearGradient id="barGradientDim" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={dimColor} stopOpacity={0.6} />
                <Stop offset="100%" stopColor={dimColor} stopOpacity={0.3} />
              </LinearGradient>
            </Defs>

            {data.map((d, i) => {
              const safeVal = Number.isFinite(d.value) ? d.value : 0;
              const barH = Math.max(4, (safeVal / max) * innerH);
              const x = slotCenter(i) - barW / 2;
              const y = PAD_TOP + innerH - barH;
              const fill = d.color
                ? d.color
                : i === peakIdx
                  ? "url(#barGradientAccent)"
                  : "url(#barGradientDim)";

              return (
                <Rect
                  key={`${d.label}-${i}`}
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={radius}
                  ry={radius}
                  fill={fill}
                />
              );
            })}
          </Svg>

          {showValues && (
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: PAD_TOP }}>
              {data.map((d, i) => (
                <Text
                  key={`value-${i}`}
                  numberOfLines={1}
                  style={{
                    position: "absolute",
                    left: slotCenter(i) - slot / 2,
                    width: slot,
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: "600",
                    color: i === peakIdx ? accentColor : "#94a3b8",
                  }}
                >
                  {Number.isFinite(d.value) ? d.value : 0}
                </Text>
              ))}
            </View>
          )}

          {showLabels && (
            <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: PAD_BOTTOM }}>
              {data.map((d, i) => (
                <Text
                  key={`label-${i}`}
                  numberOfLines={1}
                  style={{
                    position: "absolute",
                    left: slotCenter(i) - slot / 2,
                    width: slot,
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: i === peakIdx ? "600" : "400",
                    color: i === peakIdx ? accentColor : "#94a3b8",
                  }}
                >
                  {d.label}
                </Text>
              ))}
            </View>
          )}
        </>
      ) : null}
    </View>
  );
}
