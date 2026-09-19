import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { enableScreens } from "react-native-screens";
import SplashScreen from "@/screens/SplashScreen";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { screenTransition, useReducedMotion } from "@/design/motion";

import { usePushNotifications } from "@/features/notifications";

enableScreens(true);

const ThemedStack = () => {
  const { resolvedTheme } = useTheme();
  const bg = resolvedTheme === "dark" ? "#020617" : "#FFFFFF";
  const reducedMotion = useReducedMotion();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bg },
        ...screenTransition(reducedMotion),
      }}
    />
  );
};

const AppShell = () => {
  usePushNotifications();
  const { showSplash, ready } = useAppInitialization();

  return (
    <View className="flex-1">
      <ThemedStack />
      {showSplash ? <SplashScreen visible={!ready} /> : null}
    </View>
  );
};

const RootLayout = () => {
  return (
    <ErrorBoundary area="root">
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationsProvider>
              <AppShell />
            </NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default RootLayout;
