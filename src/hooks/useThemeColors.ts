import { useOptionalTheme } from "@/contexts/ThemeContext";
import { getThemeColors, type ThemeColors } from "@/theme/colors";

export const useThemeColors = (): ThemeColors => {
  const theme = useOptionalTheme();
  return getThemeColors(theme?.resolvedTheme === "dark" ? "dark" : "light");
};
