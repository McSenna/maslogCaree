export const MOBILE_ACTIVITY_COUNT = 2;
export const MOBILE_USER_COUNT = 3;

export const PANEL_FLEX = { distribution: 1, users: 1.18, activities: 0.92 };

const PANEL_CARD_PADDING = 32;

const CHART_LEGEND_GUTTER = 41;
const CHART_LEGEND_GUTTER_TIGHT = 25;

const DONUT_TIGHT_GUTTER_SIZE = 132;

const LEGEND_MIN_WIDTH = 168;

const DONUT_MIN_SIZE = 100;
const DONUT_MAX_SIZE = 180;

export const LEGEND_BESIDE_MIN_WIDTH =
  PANEL_CARD_PADDING + DONUT_MIN_SIZE + CHART_LEGEND_GUTTER_TIGHT + LEGEND_MIN_WIDTH;

export const donutSizeForPanel = (panelWidth: number): number => {
  const free = panelWidth - PANEL_CARD_PADDING - LEGEND_MIN_WIDTH;
  const roomy = free - CHART_LEGEND_GUTTER;
  if (roomy >= DONUT_TIGHT_GUTTER_SIZE) return Math.round(Math.min(DONUT_MAX_SIZE, roomy));

  const tight = free - CHART_LEGEND_GUTTER_TIGHT;
  return Math.round(Math.max(DONUT_MIN_SIZE, Math.min(DONUT_TIGHT_GUTTER_SIZE, tight)));
};

export const chartLegendGap = (donutSize: number): number => {
  const gutter =
    donutSize <= DONUT_TIGHT_GUTTER_SIZE ? CHART_LEGEND_GUTTER_TIGHT : CHART_LEGEND_GUTTER;
  return (gutter - 1) / 2;
};

export const USER_ROW_SINGLE_LINE_MIN_WIDTH = 400;

export const DENSE_METRIC_MAX_WIDTH = 370;
