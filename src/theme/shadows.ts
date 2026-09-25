import type { ViewStyle } from "react-native";
import { createShadow } from "@/design/shadow";

const INK = "#0B1744";

export const SHADOWS = {
  none: {} as ViewStyle,
  card: createShadow({ color: INK, opacity: 0.05, radius: 12, offsetY: 2, elevation: 1 }),
  raised: createShadow({ color: INK, opacity: 0.09, radius: 18, offsetY: 6, elevation: 3 }),
  overlay: createShadow({ color: INK, opacity: 0.16, radius: 32, offsetY: 12, elevation: 8 }),
} as const;

export type ShadowToken = keyof typeof SHADOWS;
