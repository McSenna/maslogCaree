import { Platform, type TextStyle, type ViewStyle } from "react-native";

export type WebOnlyStyle = {
  cursor?: "pointer" | "default" | "not-allowed" | "text";
  transition?: string;
  boxShadow?: string;
  borderColor?: string;
  outlineStyle?: "none" | "solid";
  appearance?: "none";
  position?: "sticky";
  top?: number;
  height?: string;
  minHeight?: string;
  overflow?: "hidden";
  overflowX?: "hidden";
};

export const webStyle = (style: WebOnlyStyle): ViewStyle & TextStyle =>
  (Platform.OS === "web" ? style : {}) as unknown as ViewStyle & TextStyle;
