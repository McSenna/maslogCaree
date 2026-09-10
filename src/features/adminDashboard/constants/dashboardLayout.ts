/** Mobile shows a deliberately shorter feed than the desktop panels. */
export const MOBILE_ACTIVITY_COUNT = 2;
export const MOBILE_USER_COUNT = 3;

/**
 * Relative panel widths at three columns. Recent Users carries the most content
 * per row (name, email, role, status, menu) so it takes the extra space.
 */
export const PANEL_FLEX = { distribution: 1, users: 1.18, activities: 0.92 };

/** Narrower than this, the donut's legend goes under the chart instead of beside it. */
export const LEGEND_BESIDE_MIN_WIDTH = 340;

/** Narrower than this, a recent-user row stacks its badge and status under the name. */
export const USER_ROW_SINGLE_LINE_MIN_WIDTH = 400;

/** At or below this the metric cards trim type and icons to stay 2 x 2. */
export const DENSE_METRIC_MAX_WIDTH = 370;
