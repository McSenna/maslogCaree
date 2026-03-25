import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

enableScreens(true);

export default function RootLayout() {
  return (
      <SafeAreaProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#F8F8FA" },
              animation: "fade_from_bottom",
            }}
          />
        </AuthProvider>
      </SafeAreaProvider>
  );
}
