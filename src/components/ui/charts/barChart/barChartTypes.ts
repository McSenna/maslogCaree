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
  formatTooltip?: (datum: SimpleBarDatum, index: number) => CalloutContent;
};
