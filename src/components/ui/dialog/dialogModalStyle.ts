import type { ViewStyle } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { ModalFrame } from "@/hooks/useModalFrame";
import { RADII } from "@/theme/radius";
import { SHADOWS } from "@/theme/shadows";

export const DIALOG_CONTENT_PADDING = 20;

export const buildDialogSurfaceStyle = (palette: ResidentDialogPalette, frame: ModalFrame): ViewStyle => ({
  width: frame.width,
  maxHeight: frame.maxHeight,
  borderRadius: RADII.modal,
  backgroundColor: palette.surface,
  borderColor: palette.border,
  borderWidth: 1,
  overflow: "hidden",
  ...SHADOWS.overlay,
});

export const DIALOG_BACKDROP_STYLE: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
};
