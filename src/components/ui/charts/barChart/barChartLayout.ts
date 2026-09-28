export const PAD_X = 8;
export const PAD_LEFT_AXIS = 34;
export const MAX_BAR_W = 34;
export const TICKS = 5;

type LayoutInput = {
  chartW: number;
  height: number;
  count: number;
  showValues: boolean;
  showLabels: boolean;
  showYAxis: boolean;
  maxBarWidth?: number;
};

export const resolveBarLayout = ({
  chartW,
  height,
  count,
  showValues,
  showLabels,
  showYAxis,
  maxBarWidth = MAX_BAR_W,
}: LayoutInput) => {
  const padTop = showValues ? 22 : 12;
  const padBottom = showLabels ? 22 : 8;
  const padLeft = showYAxis ? PAD_LEFT_AXIS : PAD_X;
  const innerH = height - padTop - padBottom;
  const innerW = Math.max(0, chartW - padLeft - PAD_X);
  const slot = count > 0 ? innerW / count : 0;

  return {
    padTop,
    padBottom,
    padLeft,
    innerH,
    innerW,
    slot,
    barW: Math.min(maxBarWidth, Math.max(6, slot * 0.55)),
    axisY: padTop + innerH,
    slotCenter: (i: number) => padLeft + slot * i + slot / 2,
  };
};

/** Rendered height of a bar; non-zero values get a 4px minimum so they never vanish. */
export const barHeight = (value: number, axisMax: number, innerH: number): number => {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  return Math.max(safe > 0 ? 4 : 0, (safe / axisMax) * innerH);
};

export type BarLayout = ReturnType<typeof resolveBarLayout>;
