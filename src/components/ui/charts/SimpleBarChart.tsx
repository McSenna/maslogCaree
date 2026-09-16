import { useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

import { useMountProgress } from "@/hooks/useMountProgress";

import ChartCallout, { type CalloutContent } from "./ChartCallout";
import { useChartPalette } from "./chartPalette";
import { niceCeiling } from "./chartScale";
import BarChartBars from "./barChart/BarChartBars";
import {
  BarChartHitAreas,
  BarChartLabels,
  BarChartValues,
  BarChartYAxis,
} from "./barChart/BarChartOverlays";
import { resolveBarLayout } from "./barChart/barChartLayout";
import type { SimpleBarChartProps } from "./barChart/barChartTypes";

export type { SimpleBarDatum } from "./barChart/barChartTypes";

const SimpleBarChart = ({
  data,
  height = 140,
  radius = 6,
  showLabels = true,
  showValues = false,
  accentColor = "#378ADD",
  dimColor = "#B5D4F4",
  showGrid = true,
  showYAxis = true,
  formatTooltip,
}: SimpleBarChartProps) => {
  const { gridColor, tickColor, tooltipBg, tooltipBorder } = useChartPalette();

  const [chartW, setChartW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const next = Math.round(e.nativeEvent.layout.width);
    if (next > 0 && next !== chartW) setChartW(next);
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dataKey = useMemo(() => data.map((d) => d.value).join(","), [data]);
  const progress = useMountProgress(600, dataKey);

  const max = useMemo(
    () => Math.max(1, ...data.map((d) => (Number.isFinite(d.value) ? d.value : 0))),
    [data]
  );
  const axisMax = useMemo(() => niceCeiling(max), [max]);

  const peakIdx = useMemo(
    () => data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0),
    [data]
  );

  const layout = resolveBarLayout({
    chartW,
    height,
    count: data.length,
    showValues,
    showLabels,
    showYAxis,
  });

  const measured = chartW > 0 && layout.innerW > 0 && data.length > 0;

  const active = activeIndex !== null ? data[activeIndex] : null;
  const activeContent: CalloutContent | null = active
    ? formatTooltip
      ? formatTooltip(active, activeIndex as number)
      : { title: active.label, meta: `${Number.isFinite(active.value) ? active.value : 0} events` }
    : null;

  const clearActive = () => setActiveIndex(null);
  const overlayProps = { data, layout, peakIdx, accentColor, tickColor };

  return (
    <View onLayout={onLayout} style={{ width: "100%", height }}>
      {measured ? (
        <>
          <BarChartBars
            data={data}
            layout={layout}
            chartW={chartW}
            height={height}
            axisMax={axisMax}
            radius={radius}
            accentColor={accentColor}
            dimColor={dimColor}
            gridColor={gridColor}
            showGrid={showGrid}
            peakIdx={peakIdx}
            activeIndex={activeIndex}
            progress={progress}
          />

          {showYAxis && (
            <BarChartYAxis layout={layout} axisMax={axisMax} tickColor={tickColor} />
          )}
          {showValues && <BarChartValues {...overlayProps} />}
          {showLabels && <BarChartLabels {...overlayProps} />}

          <BarChartHitAreas
            data={data}
            layout={layout}
            chartW={chartW}
            onActivate={setActiveIndex}
            onClear={clearActive}
          />

          {active && activeContent ? (
            <ChartCallout
              content={activeContent}
              x={layout.slotCenter(activeIndex as number)}
              y={layout.axisY - Math.max(4, (Math.max(0, active.value) / axisMax) * layout.innerH)}
              containerWidth={chartW}
              background={tooltipBg}
              border={tooltipBorder}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
};

export default SimpleBarChart;
