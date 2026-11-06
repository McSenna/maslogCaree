export type AppColorScheme = "light" | "dark";

/** The class Tailwind's `darkMode: "class"` keys `dark:` variants on. */
export const DARK_CLASS = "dark";

type ClassTarget = { classList: { toggle: (token: string, force: boolean) => boolean } };

/**
 * Puts the app's theme on the document. The class is written before NativeWind
 * is told: in development global.css arrives after NativeWind loads, and its
 * observer then re-reads the scheme from this class. Told first, it would fall
 * back to "system" and drop a dark choice.
 */
export const applyWebColorScheme = (
  scheme: AppColorScheme,
  root: ClassTarget,
  setInteropScheme: (scheme: AppColorScheme) => void
): void => {
  root.classList.toggle(DARK_CLASS, scheme === "dark");
  setInteropScheme(scheme);
};
