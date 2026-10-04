import { Platform, type ViewStyle } from "react-native";
import { PALETTE, withAlpha } from "@/theme/palette";

export const SHEET_RADIUS = 24;

const ELEVATION: ViewStyle =
  Platform.OS === "web"
    ? ({ boxShadow: `0 -8px 40px ${withAlpha(PALETTE.ink, 0.14)}` } as ViewStyle)
    : {
        shadowColor: PALETTE.ink,
        shadowOpacity: 0.16,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -6 },
        elevation: 16,
      };

export const buildSheetSurfaceStyle = ({
  isSheet,
  maxHeight,
  desktopWidth,
  surface,
}: {
  isSheet: boolean;
  maxHeight: number;
  desktopWidth: number;
  surface: string;
}): ViewStyle => ({
  width: "100%",
  overflow: "hidden",
  maxWidth: isSheet ? undefined : desktopWidth,
  maxHeight,
  flexDirection: "column",
  backgroundColor: surface,
  borderTopLeftRadius: SHEET_RADIUS,
  borderTopRightRadius: SHEET_RADIUS,
  borderBottomLeftRadius: isSheet ? 0 : SHEET_RADIUS,
  borderBottomRightRadius: isSheet ? 0 : SHEET_RADIUS,
  ...ELEVATION,
});
