import type { CalloutContent } from "../ChartCallout";

export type SimpleBarDatum = {
  label: string;
  value: number;
  color?: string;
  /** An incomplete period (e.g. the current month so far): drawn as a dashed outline, not a solid bar. */
  partial?: boolean;
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
  /**
   * true (default): the tallest bar is solid and the rest are dimmed, to point at one standout value.
   * false: every bar is solid, for series where each value matters equally.
   */
  highlightPeak?: boolean;
  /** Upper bound for a bar's width in px. */
  maxBarWidth?: number;
};
