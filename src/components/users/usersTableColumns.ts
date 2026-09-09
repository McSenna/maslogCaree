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
  actions: 72,
} as const;

/**
 * Below this the columns cramp, so the table scrolls horizontally instead.
 *
 * Raised when Platform Access joined the table: nine columns need more room
 * than eight before the role, status and platform pills start truncating, and
 * a sideways scroll reads better than three clipped badges. Narrow desktops
 * scroll; a full-width 1920 layout never engages it.
 */
export const TABLE_MIN_WIDTH = 1180;
