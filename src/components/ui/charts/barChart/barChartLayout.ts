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
};

export const resolveBarLayout = ({
  chartW,
  height,
  count,
  showValues,
  showLabels,
  showYAxis,
}: LayoutInput) => {
  const padTop = showValues ? 18 : 12;
  const padBottom = showLabels ? 20 : 8;
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
    barW: Math.min(MAX_BAR_W, Math.max(6, slot * 0.55)),
    axisY: padTop + innerH,
    slotCenter: (i: number) => padLeft + slot * i + slot / 2,
  };
};

export type BarLayout = ReturnType<typeof resolveBarLayout>;
