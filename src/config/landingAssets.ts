import type { ImageSourcePropType } from "react-native";

/**
 * Centralized landing page asset configuration.
 *
 * To enable the Barangay Maslog background photograph, change
 * `barangayBackground` from `null` to the actual image source:
 *
 * ```ts
 * barangayBackground: require("@/assets/images/barangay-maslog.jpg"),
 * ```
 *
 * No layout or component changes are required — the background
 * layer automatically renders the image when the source is set.
 */
export const landingAssets: {
  barangayBackground: ImageSourcePropType | null;
} = {
  barangayBackground: null,
};

/* ── Landing-specific color tokens ── */

export const LANDING_COLORS = {
  /** Primary MaslogCare blue */
  primaryBlue: "#0866F5",
  /** Deep navy for headings */
  navy: "#08152F",
  /** Healthcare green for secondary actions */
  green: "#16A34A",
  /** Muted body text */
  mutedText: "#52617A",
  /** Input / card borders */
  border: "#DDE5F0",
  /** Page background */
  pageBg: "#F8FAFC",
  /** Soft tinted backgrounds */
  softBlue: "#E7F1FF",
  softGreen: "#DDF4E5",
  softOrange: "#FFF0D7",
  /** Accent orange */
  orange: "#F59E0B",
  /** White */
  white: "#FFFFFF",
} as const;
