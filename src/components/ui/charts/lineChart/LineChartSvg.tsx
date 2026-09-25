import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop } from "react-native-svg";

import { END_DOT_R, PAD_TOP, PAD_X, TICKS } from "./lineChartLayout";
import type { LineChartGeometry } from "./lineChartLayout";
import type { LineSeries } from "./lineChartTypes";

type Palette = {
  isDark: boolean;
  gridColor: string;
  axisColor: string;
  crosshairColor: string;
  surface: string;
};

type Props = {
  series: LineSeries[];
  geometry: LineChartGeometry;
  palette: Palette;
  chartW: number;
  height: number;
  innerH: number;
  padLeft: number;
  axisY: number;
  showGrid: boolean;
  gridDashed: boolean;
  showDots: boolean;
  emphasizeLatest: boolean;
  gradientId: string;
  activeIndex: number | null;
};

const HALO_R = END_DOT_R + 5;

const LineChartSvg = ({
  series,
  geometry,
  palette,
  chartW,
  height,
  innerH,
  padLeft,
  axisY,
  showGrid,
  gridDashed,
  showDots,
  emphasizeLatest,
  gradientId,
  activeIndex,
}: Props) => {
  const { polylines, areaPaths, pointXs } = geometry;

  return (
    <Svg width={chartW} height={height}>
      <Defs>
        {series.map((s, i) =>
          s.showArea ? (
            <LinearGradient key={`grad-${i}`} id={`${gradientId}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={s.color} stopOpacity={palette.isDark ? 0.3 : 0.18} />
              <Stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </LinearGradient>
          ) : null
        )}
      </Defs>

      {showGrid &&
        Array.from({ length: TICKS + 1 }, (_, t) => t / TICKS).map((t) => {
          const y = PAD_TOP + innerH * (1 - t);
          return (
            <Line
              key={t}
              x1={padLeft}
              y1={y}
              x2={chartW - PAD_X}
              y2={y}
              stroke={palette.gridColor}
              strokeWidth={1}
              strokeDasharray={gridDashed ? "4 4" : undefined}
            />
          );
        })}

      {activeIndex !== null && pointXs[activeIndex] !== undefined ? (
        <Line
          x1={pointXs[activeIndex]}
          y1={PAD_TOP}
          x2={pointXs[activeIndex]}
          y2={axisY}
          stroke={palette.crosshairColor}
          strokeWidth={1}
        />
      ) : null}

      {areaPaths.map((ap) => (
        <Path key={`area-${ap.gradientIndex}`} d={ap.d} fill={`url(#${gradientId}-${ap.gradientIndex})`} />
      ))}

      {polylines.map((p, idx) => (
        <Path
          key={`line-${idx}`}
          d={p.d}
          fill="none"
          stroke={p.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={p.dashed ? "6 4" : undefined}
        />
      ))}

      {polylines.map((p, idx) => {
        if (p.dashed || p.points.length === 0) return null;
        const marked = showDots
          ? p.points.map((pt, di) => ({ pt, di }))
          : [{ pt: p.points[p.points.length - 1], di: p.points.length - 1 }];
        const latest = p.points[p.points.length - 1];
        return [
          emphasizeLatest && idx === 0 ? (
            <Circle
              key={`halo-${idx}`}
              cx={latest.x}
              cy={latest.y}
              r={HALO_R}
              fill={p.color}
              fillOpacity={palette.isDark ? 0.28 : 0.16}
            />
          ) : null,
          ...marked.map(({ pt, di }) => (
          <Circle
            key={`dot-${idx}-${di}`}
            cx={pt.x}
            cy={pt.y}
            r={END_DOT_R}
            fill={p.color}
            stroke={palette.surface}
            strokeWidth={2}
          />
          )),
        ];
      })}

      {activeIndex !== null &&
        polylines.map((p, idx) => {
          const pt = p.points[activeIndex];
          if (!pt || p.dashed) return null;
          return (
            <Circle
              key={`active-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r={END_DOT_R + 1}
              fill={p.color}
              stroke={palette.surface}
              strokeWidth={2}
            />
          );
        })}

      <Line
        x1={padLeft}
        y1={axisY}
        x2={chartW - PAD_X}
        y2={axisY}
        stroke={palette.axisColor}
        strokeWidth={1}
      />
    </Svg>
  );
};

export default LineChartSvg;
