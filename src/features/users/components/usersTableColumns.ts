/**
 * Desktop table geometry.
 *
 * The two fixed columns are in pixels; the rest are flex weights taken from the
 * design's column proportions, so the table stretches to fill whatever width
 * the content area gives it instead of sitting at a fixed size. Shared by the
 * header and the rows so the two can never drift apart.
 */
export const USER_COLUMNS = {
  checkbox: 48,
  user: 2.1,
  email: 2.3,
  role: 1.35,
  platform: 1.4,
  location: 1.7,
  status: 1.15,
  lastLogin: 1.4,
} as const;

/**
 * Below this the columns cramp, so the table scrolls horizontally instead.
 *
 * The role, status and platform pills start truncating before the text columns
 * do, and a sideways scroll reads better than three clipped badges. Narrow
 * desktops scroll; a full-width 1920 layout never engages it. Lowered by the
 * width of the actions column when that column was removed.
 */
export const TABLE_MIN_WIDTH = 1108;
