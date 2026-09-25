import { useEffect } from "react";
import { Platform } from "react-native";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useAuth } from "@/contexts/AuthContext";

const SPLASH_ENABLED = Platform.OS !== "web";

if (SPLASH_ENABLED) {
  void ExpoSplashScreen.preventAutoHideAsync().catch(() => {
  });
}

export const useAppInitialization = () => {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!SPLASH_ENABLED || isLoading) return;
    void ExpoSplashScreen.hideAsync().catch(() => {});
  }, [isLoading]);
};
