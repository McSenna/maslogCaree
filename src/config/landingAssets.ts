import type { ImageSourcePropType } from "react-native";
import { PALETTE } from "@/theme/palette";

export const landingAssets: {
  barangayBackground: ImageSourcePropType | null;
  brandMark: ImageSourcePropType;
} = {
  // Right-sized copies for in-app use; the full-resolution originals are reserved for app icons.
  barangayBackground: require("../../assets/images/maslog-background.jpg"),
  brandMark: require("../../assets/images/maslog-seal.png"),
};

export const LANDING_COLORS = {
  primaryBlue: PALETTE.blue[600],
  navy: PALETTE.ink,
  // The icon- and fill-safe step of Healthcare Green: white text on it is 4.6:1.
  green: PALETTE.green[600],
  mutedText: PALETTE.slate[600],
  border: PALETTE.slate[200],
  pageBg: PALETTE.canvas,
  softBlue: PALETTE.blue[50],
  softGreen: PALETTE.green[50],
  softOrange: PALETTE.orange[50],
  // Warm Orange's icon-safe step; the anchor itself is too light for a glyph on white.
  orange: PALETTE.orange[600],
  white: PALETTE.white,
} as const;
