import type { ImageSourcePropType } from "react-native";

export const landingAssets: {
  barangayBackground: ImageSourcePropType | null;
} = {
  barangayBackground: require("../../assets/images/maslogbackground.png"),
};

export const LANDING_COLORS = {
  primaryBlue: "#0866F5",
  navy: "#08152F",
  green: "#16A34A",
  mutedText: "#52617A",
  border: "#DDE5F0",
  pageBg: "#F8FAFC",
  softBlue: "#E7F1FF",
  softGreen: "#DDF4E5",
  softOrange: "#FFF0D7",
  orange: "#F59E0B",
  white: "#FFFFFF",
} as const;
