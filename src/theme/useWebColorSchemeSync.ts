import type { AppColorScheme } from "./webColorScheme";

/**
 * Native: nothing to sync. NativeWind's native `colorScheme.set` calls
 * `Appearance.setColorScheme`, which would lift the app-wide light lock
 * (`userInterfaceStyle: "light"` in app.json). The web build uses the .web.ts file.
 */
export const useWebColorSchemeSync = (scheme: AppColorScheme): void => {
  void scheme;
};
