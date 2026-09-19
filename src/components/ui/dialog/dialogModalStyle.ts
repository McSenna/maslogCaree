import type { ViewStyle } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

export const DIALOG_CONTENT_PADDING = 20;

export const buildDialogSurfaceStyle = (
  palette: ResidentDialogPalette,
  width: number,
  height: number,
  maxWidth: number
): ViewStyle => ({
  width: Math.min(maxWidth, width - 32),
  maxHeight: Math.round(height * 0.9),
  borderRadius: 20,
  backgroundColor: palette.surface,
  borderColor: palette.border,
  borderWidth: 1,
  overflow: "hidden",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.15,
  shadowRadius: 20,
  elevation: 10,
});

export const DIALOG_BACKDROP_STYLE: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
};
