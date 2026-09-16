import { useState } from "react";

import type { CalloutContent } from "../ChartCallout";
import type { LineChartGeometry } from "./lineChartLayout";
import type { LineSeries } from "./lineChartTypes";

type Options = {
  labels: string[];
  series: LineSeries[];
  geometry: LineChartGeometry;
  axisY: number;
  formatTooltip?: (index: number) => CalloutContent;
};

export const useLineChartInteraction = ({
  labels,
  series,
  geometry,
  axisY,
  formatTooltip,
}: Options) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const defaultContent = (i: number): CalloutContent => ({
    title: labels[i] ?? "",
    meta: series.map((s) => (Number.isFinite(s.values[i]) ? s.values[i] : 0)).join(" · "),
  });
  const contentFor = formatTooltip ?? defaultContent;

  return {
    activeIndex,
    setActiveIndex,
    clearActive: () => setActiveIndex(null),
    contentFor,
    activeContent: activeIndex !== null ? contentFor(activeIndex) : null,
    activeTopY:
      activeIndex !== null
        ? Math.min(...geometry.polylines.map((p) => p.points[activeIndex]?.y ?? axisY))
        : 0,
  };
};
