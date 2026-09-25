import type { CalloutContent } from "../ChartCallout";

export type SimpleBarDatum = {
  label: string;
  value: number;
  color?: string;
};

export type SimpleBarChartProps = {
  data: SimpleBarDatum[];
  height?: number;
  radius?: number;
  showLabels?: boolean;
  showValues?: boolean;
  accentColor?: string;
  dimColor?: string;
  showGrid?: boolean;
  showYAxis?: boolean;
  /** Dashed horizontal grid lines. */
  gridDashed?: boolean;
  /** Axis label colour; defaults to the chart palette's tick colour. */
  tickColor?: string;
  formatTooltip?: (datum: SimpleBarDatum, index: number) => CalloutContent;
};
