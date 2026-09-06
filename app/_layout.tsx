import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";


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

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ThemedStack />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default RootLayout;
