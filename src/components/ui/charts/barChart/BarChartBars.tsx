import { Animated } from "react-native";
import Svg, { Line } from "react-native-svg";

import { AnimatedRect } from "../animatedSvgShapes";

import { barHeight, PAD_X, TICKS, type BarLayout } from "./barChartLayout";
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
  peakIdx: number;
  highlightPeak: boolean;
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
  peakIdx,
  highlightPeak,
  activeIndex,
  progress,
}: Props) => {
  const { padTop, padLeft, innerH, barW, axisY, slotCenter } = layout;

  return (
    <Svg width={chartW} height={height}>
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
        const barH = barHeight(d.value, axisMax, innerH);
        // Solid fills only: the partial (in-progress) bar is a light tint with a dashed edge.
        const fill = d.partial ? accentColor : d.color ? d.color : !highlightPeak || i === peakIdx ? accentColor : dimColor;
        const fillOpacity = d.partial ? 0.16 : d.color || !highlightPeak || i === peakIdx ? 1 : 0.45;

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
            fillOpacity={fillOpacity}
            stroke={d.partial ? accentColor : undefined}
            strokeWidth={d.partial ? 1.5 : 0}
            strokeDasharray={d.partial ? "4 3" : undefined}
            opacity={activeIndex === null || activeIndex === i ? 1 : 0.55}
          />
        );
      })}
    </Svg>
  );
};

export default BarChartBars;
