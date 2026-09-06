import { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, { Line, Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useTheme } from "@/contexts/ThemeContext";

export type LineSeries = {
  values: number[];
  color: string;
  dashed?: boolean;
  label?: string;
  showArea?: boolean;
};

type SimpleLineChartProps = {
  labels: string[];
  series: LineSeries[];
  height?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
};

const VIEW_W = 320;
const PAD_X = 16;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;

export default function SimpleLineChart({
  labels,
  series,
  height = 160,
  showDots = true,
  showGrid = true,
  showLegend = true,
}: SimpleLineChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const axisColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const tickColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  const innerH = height - PAD_TOP - PAD_BOTTOM;
  const innerW = VIEW_W - PAD_X * 2;

  const { polylines, areaPaths } = useMemo(() => {
    const all = series.flatMap((s) => s.values.filter(Number.isFinite));
    const rawMax = Math.max(1, ...all);
    const rawMin = Math.min(0, ...all);
    const span = rawMax - rawMin || 1;
    const padY = span * 0.1;
    const maxV = rawMax + padY;
    const minV = rawMin - padY;
    const range = maxV - minV || 1;

    const count = Math.max(2, ...series.map((s) => s.values.length));
    const step = innerW / (count - 1);

    const toXY = (v: number, i: number) => ({
      x: PAD_X + i * step,
      y: PAD_TOP + innerH - ((v - minV) / range) * innerH,
    });

    const polylines = series.map((s) => {
      const pts = s.values.map((v, i) => {
        const { x, y } = toXY(v, i);
        return `${x},${y}`;
      });
      return {
        points: pts.join(" "),
        color: s.color,
        dashed: s.dashed,
        label: s.label,
        dots: s.values.map((v, i) => toXY(v, i)),
      };
    });

    const areaPaths = series
      .filter((s) => s.showArea)
      .map((s) => {
        const pts = s.values.map((v, i) => toXY(v, i));
        if (pts.length < 2) return { d: "", color: s.color };

        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
          const cp1x = (pts[i - 1].x + pts[i].x) / 2;
          const cp1y = pts[i - 1].y;
          const cp2x = (pts[i - 1].x + pts[i].x) / 2;
          const cp2y = pts[i].y;
          d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
        }
        const lastX = pts[pts.length - 1].x;
        const baseY = PAD_TOP + innerH;
        d += ` L ${lastX},${baseY} L ${PAD_X},${baseY} Z`;
        return { d, color: s.color };
      });

    return { polylines, areaPaths };
  }, [series, innerH, innerW]);

  const smoothPoints = (pts: string) => {
    const coords = pts.split(" ").map((p) => {
      const [x, y] = p.split(",").map(Number);
      return { x, y };
    });
    if (coords.length < 2) return pts;
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const cp1x = (coords[i - 1].x + coords[i].x) / 2;
      const cp1y = coords[i - 1].y;
      const cp2x = (coords[i - 1].x + coords[i].x) / 2;
      const cp2y = coords[i].y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${coords[i].x},${coords[i].y}`;
    }
    return d;
  };

  return (
    <View style={{ height: height + (showLegend && series.some((s) => s.label) ? 24 : 0) }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${VIEW_W} ${height}`}>
        <Defs>
          {series
            .filter((s) => s.showArea)
            .map((s, i) => (
              <LinearGradient
                key={`grad-${i}`}
                id={`areaGrad-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <Stop offset="0%" stopColor={s.color} stopOpacity={isDark ? 0.25 : 0.15} />
                <Stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </LinearGradient>
            ))}
        </Defs>

        {/* Horizontal grid lines */}
        {showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((t) => {
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

        {/* Area fills */}
        {areaPaths.map((ap, i) => (
          <Path
            key={`area-${i}`}
            d={ap.d}
            fill={`url(#areaGrad-${i})`}
          />
        ))}

        {/* Lines */}
        {polylines.map((p, idx) => (
          <Path
            key={`line-${idx}`}
            d={smoothPoints(p.points)}
            fill="none"
            stroke={p.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={p.dashed ? "6 4" : undefined}
          />
        ))}

        {/* Dots on primary series */}
        {showDots &&
          polylines.map((p, idx) =>
            !p.dashed
              ? p.dots.map((dot, di) => (
                  <Circle
                    key={`dot-${idx}-${di}`}
                    cx={dot.x}
                    cy={dot.y}
                    r={3.5}
                    fill={p.color}
                    stroke={isDark ? "#1a1a2e" : "#ffffff"}
                    strokeWidth={2}
                  />
                ))
              : null
          )}

        {/* X-axis baseline */}
        <Line
          x1={PAD_X}
          y1={PAD_TOP + innerH}
          x2={VIEW_W - PAD_X}
          y2={PAD_TOP + innerH}
          stroke={axisColor}
          strokeWidth={1}
        />
      </Svg>

      {/* X-axis labels */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: PAD_X,
          marginTop: -PAD_BOTTOM + 4,
        }}
      >
        {labels.map((lab, i) => (
          <Text
            key={`${lab}-${i}`}
            style={{
              fontSize: 9,
              fontWeight: "400",
              color: tickColor,
            }}
            numberOfLines={1}
          >
            {lab}
          </Text>
        ))}
      </View>

      {/* Legend */}
      {showLegend && series.some((s) => s.label) && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 8,
            paddingHorizontal: PAD_X,
          }}
        >
          {series
            .filter((s) => s.label)
            .map((s, i) => (
              <View
                key={`legend-${i}`}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 2.5,
                    borderRadius: 2,
                    backgroundColor: s.color,
                    opacity: s.dashed ? 0.7 : 1,
                  }}
                />
                <Text style={{ fontSize: 10, color: tickColor }}>{s.label}</Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}