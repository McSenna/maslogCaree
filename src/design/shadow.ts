import { Platform, type ViewStyle } from "react-native";

export type ShadowSpec = {
  color: string;
  offsetX?: number;
  offsetY: number;
  radius: number;
  opacity: number;
  elevation?: number;
};

const hexToRgb = (hex: string) => {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.replace(/./g, (char) => char + char) : raw;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

/**
 * React Native Web deprecates the `shadow*` style props in favour of `boxShadow`,
 * while Android (New Architecture) still renders `shadow*` together with
 * `elevation`. Emitting only the form each platform supports keeps the rendered
 * shadow identical to what the app produced before, and the web string matches
 * the value React Native Web previously derived from the same numbers.
 */
export const createShadow = ({
  color,
  offsetX = 0,
  offsetY,
  radius,
  opacity,
  elevation,
}: ShadowSpec): ViewStyle => {
  if (Platform.OS === "web") {
    const { r, g, b } = hexToRgb(color);
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(${r},${g},${b},${opacity.toFixed(2)})`,
    };
  }

  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    ...(elevation === undefined ? null : { elevation }),
  };
};
