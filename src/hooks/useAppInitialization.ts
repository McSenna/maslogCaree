import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useAuth } from "@/contexts/AuthContext";
import { SPLASH_TIMING } from "@/components/splash/splashTheme";

/**
 * The splash is a native-app gesture, not a web one.
 *
 * On a phone it covers a real cold start — the bundle, the native shell and the
 * session restore — and the minimum-visible floor stops it flashing past. A
 * browser tab has none of that: the page is already painted, so the same floor
 * is just under two seconds of held-back UI on every single load, including
 * every refresh while working. Web goes straight to the app.
 *
 * This does not touch the session guard: `RouteGuard` still waits for auth
 * before rendering anything protected.
 */
const SPLASH_ENABLED = Platform.OS !== "web";

// Hold the native splash until the React one has painted, so the handover is a
// single continuous screen rather than a white flash between the two.
if (SPLASH_ENABLED) {
  void ExpoSplashScreen.preventAutoHideAsync().catch(() => {
    // Already hidden, or called twice under Fast Refresh — neither matters.
  });
}

type InitializationState = {
  /** The splash is still on screen. */
  showSplash: boolean;
  /** Startup finished; the splash is mid-fade and will unmount shortly. */
  ready: boolean;
};

/**
 * Startup gate for the app shell.
 *
 * The real work is the session restore `AuthProvider` already performs — this
 * hook waits for it rather than duplicating any auth logic, then holds the
 * splash for a floor of ~1.8s so a fast cold start does not flash past.
 *
 * On web the splash is skipped entirely: both flags start settled, no timers
 * are scheduled, and the app renders immediately.
 *
 * Returns two flags because the splash needs to fade before it unmounts:
 * `ready` starts the fade, `showSplash` removes it once the fade has run.
 */
export const useAppInitialization = (): InitializationState => {
  const { isLoading } = useAuth();

  // Web starts already finished, so the routed tree is what paints first.
  const [ready, setReady] = useState(!SPLASH_ENABLED);
  const [showSplash, setShowSplash] = useState(SPLASH_ENABLED);

  /** When the splash first appeared, for the minimum-visible floor. */
  const startedAt = useRef(Date.now());

  // Let the native splash go as soon as the JS tree is up.
  useEffect(() => {
    if (!SPLASH_ENABLED) return;
    void ExpoSplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (!SPLASH_ENABLED || isLoading || ready) return;

    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, SPLASH_TIMING.minimumVisible - elapsed);

    const timer = setTimeout(() => setReady(true), remaining);
    return () => clearTimeout(timer);
  }, [isLoading, ready]);

  // Unmount only after the cross-fade has finished.
  useEffect(() => {
    if (!SPLASH_ENABLED || !ready) return;

    const timer = setTimeout(() => setShowSplash(false), SPLASH_TIMING.fadeOut);
    return () => clearTimeout(timer);
  }, [ready]);

  return { showSplash, ready };
};
