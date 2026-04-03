import { Switch, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemePreferenceEndSlot() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-xs font-medium text-slate-500">{dark ? "Dark" : "Light"}</Text>
      <Switch
        accessibilityLabel={dark ? "Switch to light mode" : "Switch to dark mode"}
        value={dark}
        onValueChange={(v) => setTheme(v ? "dark" : "light")}
        trackColor={{ false: "#e2e8f0", true: "#38bdf8" }}
        thumbColor="#ffffff"
      />
    </View>
  );
}
