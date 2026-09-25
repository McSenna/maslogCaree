import { useMemo, useState } from "react";
import { Animated, LayoutChangeEvent, View } from "react-native";

import { useMountProgress } from "@/hooks/useMountProgress";

import ChartCallout from "./ChartCallout";
import { useChartPalette } from "./chartPalette";
import { useSvgId } from "./useSvgId";
import LineChartAxes from "./lineChart/LineChartAxes";
import LineChartHitAreas from "./lineChart/LineChartHitAreas";
import LineChartLegend from "./lineChart/LineChartLegend";
import LineChartSvg from "./lineChart/LineChartSvg";
import {
  LEGEND_H,
  PAD_BOTTOM,
  PAD_LEFT_AXIS,
  PAD_TOP,
  PAD_X,
  useLineChartGeometry,
} from "./lineChart/lineChartLayout";
import { useLineChartInteraction } from "./lineChart/useLineChartInteraction";
import type { SimpleLineChartProps } from "./lineChart/lineChartTypes";

export type { LineSeries } from "./lineChart/lineChartTypes";

const SimpleLineChart = ({
  labels,
  series,
  height = 160,
  showDots = false,
  showGrid = true,
  showYAxis = true,
  showLegend = true,
  baselineAtZero = true,
  gridDashed = false,
  tickColor: tickColorOverride,
  emphasizeLatest = false,
  formatTooltip,
}: SimpleLineChartProps) => {
  const palette = useChartPalette();
  const tickColor = tickColorOverride ?? palette.tickColor;
  const gradientId = useSvgId("lineArea");
  const latestIndex = emphasizeLatest ? labels.length - 1 : null;

  const [chartW, setChartW] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const next = Math.round(e.nativeEvent.layout.width);
    if (next > 0 && next !== chartW) setChartW(next);
  };

  const seriesKey = useMemo(() => series.map((s) => s.values.join(",")).join("|"), [series]);
  const progress = useMountProgress(600, seriesKey);

  const padLeft = showYAxis ? PAD_LEFT_AXIS : PAD_X;
  const innerH = height - PAD_TOP - PAD_BOTTOM;
  const innerW = Math.max(0, chartW - padLeft - PAD_X);
  const hasLegend = showLegend && series.some((s) => s.label);
  const axisY = PAD_TOP + innerH;

  const geometry = useLineChartGeometry({
    series,
    innerH,
    innerW,
    padLeft,
    axisY,
    baselineAtZero,
  });

  const measured = chartW > 0 && innerW > 0;

  const { activeIndex, setActiveIndex, clearActive, contentFor, activeContent, activeTopY } =
    useLineChartInteraction({ labels, series, geometry, axisY, formatTooltip });

  return (
    <View
      onLayout={onLayout}
      style={{ width: "100%", height: height + (hasLegend ? LEGEND_H : 0) }}
    >
      {measured ? (
        <Animated.View
          style={{
            width: chartW,
            height,
            opacity: progress,
            transform: [
              { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
            ],
          }}
        >
          <LineChartSvg
            series={series}
            geometry={geometry}
            palette={palette}
            chartW={chartW}
            height={height}
            innerH={innerH}
            padLeft={padLeft}
            axisY={axisY}
            showGrid={showGrid}
            gridDashed={gridDashed}
            showDots={showDots}
            emphasizeLatest={emphasizeLatest}
            gradientId={gradientId}
            activeIndex={activeIndex}
          />

          <LineChartAxes
            labels={labels}
            pointXs={geometry.pointXs}
            step={geometry.step}
            axisMax={geometry.axisMax}
            chartW={chartW}
            innerH={innerH}
            padLeft={padLeft}
            axisY={axisY}
            tickColor={tickColor}
            showYAxis={showYAxis}
            activeIndex={activeIndex}
            emphasisIndex={latestIndex}
            emphasisColor={series[0]?.color}
          />

          <LineChartHitAreas
            pointXs={geometry.pointXs}
            step={geometry.step}
            chartW={chartW}
            axisY={axisY}
            accessibilityLabelFor={(i) => `${labels[i] ?? ""}: ${contentFor(i).meta}`}
            onActivate={setActiveIndex}
            onClear={clearActive}
          />

          {activeContent && activeIndex !== null ? (
            <ChartCallout
              content={activeContent}
              x={geometry.pointXs[activeIndex] ?? 0}
              y={activeTopY}
              containerWidth={chartW}
              background={palette.tooltipBg}
              border={palette.tooltipBorder}
            />
          ) : null}
        </Animated.View>
      ) : null}

      {hasLegend && (
        <LineChartLegend series={series} padLeft={padLeft} tickColor={tickColor} />
      )}
    </View>
  );
};

export default SimpleLineChart;
