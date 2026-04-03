import { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";
import { chartColors } from "@/design/dashboardTheme";
import { useTheme } from "@/contexts/ThemeContext";

export type LineSeries = {
  values: number[];
  color: string;
  dashed?: boolean;
};

type SimpleLineChartProps = {
  labels: string[];
  series: LineSeries[];
  height?: number;
};

const VIEW_W = 300;
const PAD_X = 12;
const PAD_TOP = 10;
const PAD_BOTTOM = 22;

export default function SimpleLineChart({
  labels,
  series,
  height = 150,
}: SimpleLineChartProps) {
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === "dark" ? "#64748b" : "#94a3b8";
  const gridColor = chartColors.grid;

  const innerH = height - PAD_TOP - PAD_BOTTOM;
  const innerW = VIEW_W - PAD_X * 2;

  const polylines = useMemo(() => {
    const all = series.flatMap((s) => s.values);
    const rawMax = Math.max(1, ...all);
    const rawMin = Math.min(0, ...all);
    const span = rawMax - rawMin || 1;
    const padY = span * 0.08;
    const maxV = rawMax + padY;
    const minV = rawMin - padY;
    const range = maxV - minV || 1;

    const count = Math.max(1, ...series.map((s) => s.values.length));
    const step = count > 1 ? innerW / (count - 1) : 0;

    return series.map((s) => {
      const pts = s.values.map((v, i) => {
        const x = PAD_X + i * step;
        const y = PAD_TOP + innerH - ((v - minV) / range) * innerH;
        return `${x},${y}`;
      });
      return {
        points: pts.join(" "),
        color: s.color,
        dashed: s.dashed,
      };
    });
  }, [series, innerH, innerW]);

  return (
    <View style={{ height }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_W} ${height}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD_TOP + innerH * (1 - t);
          return (
            <Line
              key={t}
              x1={PAD_X}
              y1={y}
              x2={VIEW_W - PAD_X}
              y2={y}
              stroke={gridColor}
              strokeWidth={1}
            />
          );
        })}

        {polylines.map((p, idx) => (
          <Polyline
            key={idx}
            points={p.points}
            fill="none"
            stroke={p.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={p.dashed ? "6 6" : undefined}
          />
        ))}

        <Line
          x1={PAD_X}
          y1={PAD_TOP + innerH}
          x2={VIEW_W - PAD_X}
          y2={PAD_TOP + innerH}
          stroke={axisColor}
          strokeWidth={1}
        />
      </Svg>

      <View className="mt-1 flex-row flex-wrap justify-between px-1">
        {labels.map((lab, i) => (
          <Text
            key={`${lab}-${i}`}
            className="text-[9px] font-medium text-slate-500"
            numberOfLines={1}
          >
            {lab}
          </Text>
        ))}
      </View>
    </View>
  );
}
