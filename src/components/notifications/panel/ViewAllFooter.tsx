import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

const ViewAllFooter = ({ onPress }: { onPress: () => void }) => {
  const { resolvedTheme, classes } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className={`border-t ${isDark ? "border-slate-700/60" : "border-slate-100"}`}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View all notifications"
        onPress={onPress}
        className="flex-row items-center justify-center gap-1.5 py-3"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className={`text-sm font-semibold ${classes.textAccent}`}>
          View All Notifications
        </Text>
        <Feather name="arrow-right" size={14} color={isDark ? "#38bdf8" : "#0369a1"} />
      </Pressable>
    </View>
  );
};

export default ViewAllFooter;
