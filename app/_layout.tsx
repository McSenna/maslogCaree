import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ActionDialogHost from "@/components/feedback/dialog/ActionDialogHost";
import ToastViewport from "@/components/feedback/toast/ToastViewport";
import HydrationBoundary from "@/components/layout/HydrationBoundary";
import { enableScreens } from "react-native-screens";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { screenTransition, useReducedMotion } from "@/theme/motion";

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
  useAppInitialization();

  return (
    <View className="flex-1">
      <HydrationBoundary>
        <ThemedStack />
        <ToastViewport />
        <ActionDialogHost />
      </HydrationBoundary>
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
};

export default RootLayout;
