import type { CalloutContent } from "../ChartCallout";

export type LineSeries = {
  values: number[];
  color: string;
  dashed?: boolean;
  label?: string;
  showArea?: boolean;
};

export type SimpleLineChartProps = {
  labels: string[];
  series: LineSeries[];
  height?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  baselineAtZero?: boolean;
  /** Dashed horizontal grid lines. */
  gridDashed?: boolean;
  /** Axis label colour; defaults to the chart palette's tick colour. */
  tickColor?: string;
  /** Soft halo on the latest point and a bold, series-coloured latest x label. */
  emphasizeLatest?: boolean;
  formatTooltip?: (index: number) => CalloutContent;
};
