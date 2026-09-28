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
  navy: "#08152F",
  // Teal rather than green: white text on it passes AA (5.5:1), and it keeps the
  // landing palette to the product's blue and teal.
  green: PALETTE.teal[700],
  mutedText: "#52617A",
  border: "#DDE5F0",
  pageBg: "#F8FAFC",
  softBlue: "#E7F1FF",
  softGreen: PALETTE.teal[100],
  softOrange: "#FFF0D7",
  orange: "#F59E0B",
  white: "#FFFFFF",
} as const;
