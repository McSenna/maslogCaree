import { useEffect } from "react";
import { colorScheme } from "nativewind";

import { applyWebColorScheme, type AppColorScheme } from "./webColorScheme";

/** Makes NativeWind's `dark:` variants follow the app's theme choice on web. */
export const useWebColorSchemeSync = (scheme: AppColorScheme): void => {
  useEffect(() => {
    applyWebColorScheme(scheme, document.documentElement, colorScheme.set);
  }, [scheme]);
};
