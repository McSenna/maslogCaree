import { useMemo } from "react";
import { View, Text } from "react-native";
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

export default function SimpleBarChart({
  data,
  height = 140,
  radius = 6,
  showLabels = true,
  showValues = false,
  accentColor = "#378ADD",
  dimColor = "#B5D4F4",
}: SimpleBarChartProps) {
  const max = useMemo(
    () =>
      Math.max(1, ...data.map((d) => (Number.isFinite(d.value) ? d.value : 0))),
    [data]
  );

  const peakIdx = useMemo(
    () =>
      data.reduce(
        (best, d, i) => (d.value > data[best].value ? i : best),
        0
      ),
    [data]
  );

  const BAR_W = 20;
  const BAR_GAP = 10;
  const PAD_X = 8;
  const PAD_TOP = showValues ? 18 : 8;
  const PAD_BOTTOM = showLabels ? 20 : 8;
  const innerH = height - PAD_TOP - PAD_BOTTOM;

  const totalW = PAD_X * 2 + data.length * BAR_W + Math.max(0, data.length - 1) * BAR_GAP;

  return (
    <View style={{ height }}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${totalW} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
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
          const x = PAD_X + i * (BAR_W + BAR_GAP);
          const y = PAD_TOP + innerH - barH;
          const isPeak = i === peakIdx;
          const fill = d.color
            ? d.color
            : isPeak
            ? "url(#barGradientAccent)"
            : "url(#barGradientDim)";

          return (
            <Rect
              key={`${d.label}-${i}`}
              x={x}
              y={y}
              width={BAR_W}
              height={barH}
              rx={radius}
              ry={radius}
              fill={fill}
            />
          );
        })}
      </Svg>

      {showLabels && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            paddingHorizontal: PAD_X,
          }}
        >
          {data.map((d, i) => (
            <View
              key={`label-${i}`}
              style={{
                width: BAR_W,
                marginRight: i < data.length - 1 ? BAR_GAP : 0,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: i === peakIdx ? "600" : "400",
                  color: i === peakIdx ? accentColor : "#94a3b8",
                }}
                numberOfLines={1}
              >
                {d.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}