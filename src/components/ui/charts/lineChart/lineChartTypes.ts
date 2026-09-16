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
  formatTooltip?: (index: number) => CalloutContent;
};
