import { Platform, type ViewStyle } from "react-native";

export const SHEET_RADIUS = 24;

const ELEVATION: ViewStyle =
  Platform.OS === "web"
    ? ({ boxShadow: "0 -8px 40px rgba(15,37,87,0.14)" } as ViewStyle)
    : {
        shadowColor: "#0F2557",
        shadowOpacity: 0.16,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -6 },
        elevation: 16,
      };

export const buildSheetSurfaceStyle = ({
  isSheet,
  maxHeight,
  marginBottom,
  desktopWidth,
  surface,
}: {
  isSheet: boolean;
  maxHeight: number;
  marginBottom: number;
  desktopWidth: number;
  surface: string;
}): ViewStyle => ({
  width: "100%",
  overflow: "hidden",
  maxWidth: isSheet ? undefined : desktopWidth,
  maxHeight,
  flexDirection: "column",
  marginBottom,
  backgroundColor: surface,
  borderTopLeftRadius: SHEET_RADIUS,
  borderTopRightRadius: SHEET_RADIUS,
  borderBottomLeftRadius: isSheet ? 0 : SHEET_RADIUS,
  borderBottomRightRadius: isSheet ? 0 : SHEET_RADIUS,
  ...ELEVATION,
});
