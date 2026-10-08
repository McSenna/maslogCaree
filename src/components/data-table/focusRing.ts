import type { ViewStyle } from "react-native";

/** The 2px keyboard focus ring every table control shows. Inset (-2) on rows, whose card clips outside them. */
export const focusRing = (color: string, offset = 2): ViewStyle => ({
  outlineWidth: 2,
  outlineStyle: "solid",
  outlineColor: color,
  outlineOffset: offset,
});
