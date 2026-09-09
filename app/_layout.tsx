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

const ThemedStack = () => {
  const { resolvedTheme } = useTheme();
  const bg = resolvedTheme === "dark" ? "#020617" : "#FFFFFF";


  enableScreens(true);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bg },
        animation: "none",
      }}
    />
  );
}

/**
 * Holds the splash over the app until startup finishes.
 *
 * The splash is an overlay, not a route. Under expo-router a `/splash` screen
 * would sit in the history stack and Android Back could return to it; an
 * overlay has nothing to go back to, so the first thing Back can reach is the
 * landing page. It also means no `router.replace` is needed — the routed tree
 * mounts underneath from the start and is simply revealed.
 *
 * Sits inside `AuthProvider` because the initialisation it waits on is that
 * provider's session restore.
 */
const AppShell = () => {
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
