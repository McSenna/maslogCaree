import { Animated } from "react-native";
import Svg, { Defs, LinearGradient, Line, Stop } from "react-native-svg";

import { AnimatedRect } from "../animatedSvgShapes";

import { PAD_X, TICKS, type BarLayout } from "./barChartLayout";
import type { SimpleBarDatum } from "./barChartTypes";

type Props = {
  data: SimpleBarDatum[];
  layout: BarLayout;
  chartW: number;
  height: number;
  axisMax: number;
  radius: number;
  accentColor: string;
  dimColor: string;
  gridColor: string;
  showGrid: boolean;
  gridDashed: boolean;
  gradientId: string;
  peakIdx: number;
  activeIndex: number | null;
  progress: Animated.Value;
};

const BarChartBars = ({
  data,
  layout,
  chartW,
  height,
  axisMax,
  radius,
  accentColor,
  dimColor,
  gridColor,
  showGrid,
  gridDashed,
  gradientId,
  peakIdx,
  activeIndex,
  progress,
}: Props) => {
  const { padTop, padLeft, innerH, barW, axisY, slotCenter } = layout;

  return (
    <Svg width={chartW} height={height}>
      <Defs>
        <LinearGradient id={`${gradientId}-accent`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={accentColor} stopOpacity={1} />
          <Stop offset="100%" stopColor={accentColor} stopOpacity={0.7} />
        </LinearGradient>
        <LinearGradient id={`${gradientId}-dim`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={dimColor} stopOpacity={0.6} />
          <Stop offset="100%" stopColor={dimColor} stopOpacity={0.3} />
        </LinearGradient>
      </Defs>

      {showGrid &&
        Array.from({ length: TICKS + 1 }, (_, t) => t / TICKS).map((t) => {
          const y = padTop + innerH * (1 - t);
          return (
            <Line
              key={t}
              x1={padLeft}
              y1={y}
              x2={chartW - PAD_X}
              y2={y}
              stroke={gridColor}
              strokeWidth={1}
              strokeDasharray={gridDashed ? "4 4" : undefined}
            />
          );
        })}

      {data.map((d, i) => {
        const safeVal = Number.isFinite(d.value) ? d.value : 0;
        const barH = Math.max(safeVal > 0 ? 4 : 0, (safeVal / axisMax) * innerH);
        const fill = d.color
          ? d.color
          : i === peakIdx
            ? `url(#${gradientId}-accent)`
            : `url(#${gradientId}-dim)`;

        return (
          <AnimatedRect
            key={`${d.label}-${i}`}
            x={slotCenter(i) - barW / 2}
            y={progress.interpolate({ inputRange: [0, 1], outputRange: [axisY, axisY - barH] })}
            width={barW}
            height={progress.interpolate({ inputRange: [0, 1], outputRange: [0, barH] })}
            rx={radius}
            ry={radius}
            fill={fill}
            opacity={activeIndex === null || activeIndex === i ? 1 : 0.55}
          />
        );
      })}
    </Svg>
  );
};

export default BarChartBars;
