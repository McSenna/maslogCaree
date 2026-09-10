/**
 * Surface tokens shared by every admin table page.
 *
 * User Management, Inventory and System Logs are the same page shape with
 * different rows, so the card elevation, control height and radius scale live
 * here rather than in whichever feature happened to define them first.
 */

/** Subtle elevation shared by every admin surface. */
export const CARD_SHADOW = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

/** Height of every control on the admin toolbar — search, menus, buttons. */
export const CONTROL_HEIGHT = 48;

/**
 * Radius scale for these pages, matching the design: soft cards, tighter
 * inputs and buttons, fully rounded badges.
 */
export const RADIUS = {
  card: 16,
  panel: 14,
  control: 10,
  pill: 9999,
} as const;

/** A status or role pill. */
export type BadgeTone = {
  label: string;
  /** Text colour — dark enough to pass contrast on `bg`. */
  text: string;
  /** Pill fill. */
  bg: string;
  /** Vivid dot, so a status is never carried by text colour alone. */
  dot?: string;
};
