import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useAuth } from "@/contexts/AuthContext";
import { SPLASH_TIMING } from "@/components/splash/splashTheme";

const SPLASH_ENABLED = Platform.OS !== "web";

if (SPLASH_ENABLED) {
  void ExpoSplashScreen.preventAutoHideAsync().catch(() => {
  });
}

type InitializationState = {
  showSplash: boolean;
  ready: boolean;
};

export const useAppInitialization = (): InitializationState => {
  const { isLoading } = useAuth();

  const [ready, setReady] = useState(!SPLASH_ENABLED);
  const [showSplash, setShowSplash] = useState(SPLASH_ENABLED);

  const startedAt = useRef(Date.now());

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

  useEffect(() => {
    if (!SPLASH_ENABLED || !ready) return;

    const timer = setTimeout(() => setShowSplash(false), SPLASH_TIMING.fadeOut);
    return () => clearTimeout(timer);
  }, [ready]);

  return { showSplash, ready };
};
