/**
 * Design tokens for the Book an Appointment form.
 *
 * The booking form is a fixed light healthcare surface, like the landing and
 * auth screens: it is the one place a resident confirms medical details, and
 * the approved design specifies these exact tints. Keeping them in one file
 * means the field, the bottom sheet and the confirmation step cannot drift
 * apart the way three separate colour lists would.
 */

export const APPOINTMENT_COLORS = {
  /** Headings, labels and the primary action outline. */
  primary: "#1D4ED8",
  primaryDeep: "#1E3A8A",
  primaryBright: "#2563EB",
  /** Card and banner fills, one step off white. */
  surfaceTint: "#EFF6FF",
  surfaceTintStrong: "#E0EAFB",
  white: "#FFFFFF",
  /** Page ground behind the form. */
  pageBg: "#FFFFFF",
  border: "#DBE4F2",
  borderStrong: "#BFD3F0",
  divider: "#E8EEF8",
  bodyText: "#1E3A8A",
  mutedText: "#64748B",
  placeholder: "#9AA8BE",
  /** Confirmed / auto-filled affirmations. */
  successBg: "#DCFCE7",
  success: "#16A34A",
  /** The primary booking action. */
  actionGreen: "#15803D",
  actionGreenPressed: "#137035",
  /** Required markers and validation. */
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  dangerBorder: "#FECACA",
  /** Cancel / secondary control. */
  neutralBg: "#EDF1F7",
  track: "#E2E8F0",
} as const;

export const APPOINTMENT_METRICS = {
  /** Controls clear the 44px touch minimum with room to spare. */
  fieldHeight: 54,
  optionMinHeight: 54,
  buttonHeight: 52,
  radiusField: 12,
  radiusCard: 16,
  radiusSheet: 22,
} as const;

/** Character ceiling for both free-text fields, mirrored by the counter. */
export const TEXT_LIMIT = 500;
