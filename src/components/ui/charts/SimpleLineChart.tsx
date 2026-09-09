import { useMemo, useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
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

const PAD_X = 16;
const PAD_TOP = 12;
/** Band reserved at the bottom of the plot for the x-axis labels. */
const PAD_BOTTOM = 24;
const LEGEND_H = 24;

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

  /**
   * The chart is drawn at its measured pixel size rather than into a fixed
   * viewBox. A fixed viewBox plus width="100%" makes SVG scale the drawing
   * uniformly to *fit* and then centre it, so in a wide card the plot renders
   * at its viewBox width in the middle with empty gutters either side. Keeping
   * 1 SVG unit == 1px means the plot fills the card and strokes/dots stay
   * perfectly round.
   */
  const [chartW, setChartW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const next = Math.round(e.nativeEvent.layout.width);
    if (next > 0 && next !== chartW) setChartW(next);
  };

  const axisColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const tickColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  const innerH = height - PAD_TOP - PAD_BOTTOM;
  const innerW = Math.max(0, chartW - PAD_X * 2);
  const hasLegend = showLegend && series.some((s) => s.label);

  const { polylines, areaPaths, pointXs, step } = useMemo(() => {
    const all = series.flatMap((s) => s.values.filter(Number.isFinite));
    const rawMax = Math.max(1, ...all);
    const rawMin = Math.min(0, ...all);
    const span = rawMax - rawMin || 1;
    const padY = span * 0.1;
    const maxV = rawMax + padY;
    const minV = rawMin - padY;
    const range = maxV - minV || 1;

    const count = Math.max(2, ...series.map((s) => s.values.length));
    const stepX = innerW / (count - 1);

    const toXY = (v: number, i: number) => ({
      x: PAD_X + i * stepX,
      y: PAD_TOP + innerH - ((v - minV) / range) * innerH,
    });

    const lines = series.map((s) => ({
      points: s.values.map((v, i) => toXY(v, i)),
      color: s.color,
      dashed: s.dashed,
      label: s.label,
    }));

    // Curve through the points, used for both the stroke and the area fill so
    // the two can never disagree.
    const curve = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return "";
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const midX = (pts[i - 1].x + pts[i].x) / 2;
        d += ` C ${midX},${pts[i - 1].y} ${midX},${pts[i].y} ${pts[i].x},${pts[i].y}`;
      }
      return d;
    };

    const areas = series
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => s.showArea)
      .map(({ idx }) => {
        const pts = lines[idx].points;
        if (pts.length < 2) return { d: "", gradientIndex: idx };
        const baseY = PAD_TOP + innerH;
        return {
          d: `${curve(pts)} L ${pts[pts.length - 1].x},${baseY} L ${PAD_X},${baseY} Z`,
          gradientIndex: idx,
        };
      });

    return {
      polylines: lines.map((l) => ({ ...l, d: curve(l.points) })),
      areaPaths: areas,
      // Label positions come from the same x coordinates the points use, so
      // a label can never drift away from its data point.
      pointXs: Array.from({ length: count }, (_, i) => PAD_X + i * stepX),
      step: stepX,
    };
  }, [series, innerH, innerW]);

  const measured = chartW > 0 && innerW > 0;

  return (
    <View onLayout={onLayout} style={{ width: "100%", height: height + (hasLegend ? LEGEND_H : 0) }}>
      {measured ? (
        <>
          <Svg width={chartW} height={height}>
            <Defs>
              {series.map((s, i) =>
                s.showArea ? (
                  <LinearGradient key={`grad-${i}`} id={`areaGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={s.color} stopOpacity={isDark ? 0.25 : 0.15} />
                    <Stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </LinearGradient>
                ) : null
              )}
            </Defs>

            {showGrid &&
              [0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = PAD_TOP + innerH * (1 - t);
                return (
                  <Line key={t} x1={PAD_X} y1={y} x2={chartW - PAD_X} y2={y} stroke={gridColor} strokeWidth={1} />
                );
              })}

            {areaPaths.map((ap) => (
              <Path key={`area-${ap.gradientIndex}`} d={ap.d} fill={`url(#areaGrad-${ap.gradientIndex})`} />
            ))}

            {polylines.map((p, idx) => (
              <Path
                key={`line-${idx}`}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={p.dashed ? "6 4" : undefined}
              />
            ))}

            {showDots &&
              polylines.map((p, idx) =>
                !p.dashed
                  ? p.points.map((dot, di) => (
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

            <Line
              x1={PAD_X}
              y1={PAD_TOP + innerH}
              x2={chartW - PAD_X}
              y2={PAD_TOP + innerH}
              stroke={axisColor}
              strokeWidth={1}
            />
          </Svg>

          {/* Each label is centred on its own point's x, inside the band the
              plot already reserved — no negative margins, no second layout
              system that could drift out of step with the data. */}
          <View style={{ position: "absolute", top: PAD_TOP + innerH + 6, left: 0, right: 0, height: PAD_BOTTOM }}>
            {labels.map((lab, i) => {
              const x = pointXs[i];
              if (x === undefined) return null;
              // Capped at the slot width so neighbouring labels cannot collide,
              // and deliberately not clamped to the container: the end labels
              // bleed a few px into the card's own padding rather than sliding
              // off their data point.
              const boxW = Math.max(24, Math.min(56, step));
              return (
                <Text
                  key={`${lab}-${i}`}
                  numberOfLines={1}
                  style={{
                    position: "absolute",
                    left: x - boxW / 2,
                    width: boxW,
                    textAlign: "center",
                    fontSize: 10,
                    color: tickColor,
                  }}
                >
                  {lab}
                </Text>
              );
            })}
          </View>
        </>
      ) : null}

      {hasLegend && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: PAD_X,
            right: PAD_X,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {series
            .filter((s) => s.label)
            .map((s, i) => (
              <View key={`legend-${i}`} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
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
