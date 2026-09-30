import { vars } from "nativewind";

import { useTheme } from "@/contexts/ThemeContext";
import {
  ANNOUNCEMENT_DARK,
  ANNOUNCEMENT_LIGHT,
  toAnnouncementVariables,
} from "@/theme/announcementTokens";

const LIGHT_VARS = vars(toAnnouncementVariables(ANNOUNCEMENT_LIGHT));
const DARK_VARS = vars(toAnnouncementVariables(ANNOUNCEMENT_DARK));

/**
 * `vars` goes on the style of each root that draws announcement classes: the
 * screen, and every Modal (a web portal sits outside the screen's DOM, so it
 * does not inherit the variables). `palette` is for the few props NativeWind
 * cannot reach: icon colours, RefreshControl tint, placeholder text.
 */
export const useAnnouncementTheme = () => {
  const isDark = useTheme().resolvedTheme === "dark";
  return {
    isDark,
    vars: isDark ? DARK_VARS : LIGHT_VARS,
    palette: isDark ? ANNOUNCEMENT_DARK : ANNOUNCEMENT_LIGHT,
  };
};
