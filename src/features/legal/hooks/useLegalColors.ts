import { useThemeColors } from "@/hooks/useThemeColors";
import { getThemeColors, type ThemeColors } from "@/theme/colors";

/**
 * Where a legal document is drawn. The public pages sit on the light-only
 * public layout (MainLayout is white), so they must not take dark-theme text
 * colors; dialogs draw their own surface and follow the app theme.
 */
export type LegalSurface = "public" | "themed";

const PUBLIC_COLORS = getThemeColors("light");

export const useLegalColors = (surface: LegalSurface): ThemeColors => {
  const themed = useThemeColors();
  return surface === "public" ? PUBLIC_COLORS : themed;
};
