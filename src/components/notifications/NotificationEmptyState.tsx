import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const NotificationEmptyState = () => {
  const { resolvedTheme, classes } = useTheme();

  const iconBg =
    resolvedTheme === "dark" ? "bg-slate-800" : "bg-slate-100";
  const iconColor =
    resolvedTheme === "dark" ? "#64748b" : "#94a3b8";

  return (
    <View className="items-center justify-center px-6 py-12">
      <View
        className={`mb-4 h-16 w-16 items-center justify-center rounded-full ${iconBg}`}
      >
        <Feather name="bell-off" size={28} color={iconColor} />
      </View>

      <Text
        className={`mb-1 text-base font-bold ${classes.textPrimary}`}
      >
        You&apos;re all caught up
      </Text>

      <Text
        className={`text-center text-sm leading-relaxed ${classes.textMuted}`}
      >
        There are no notifications{"\n"}right now.
      </Text>
    </View>
  );
};

export default React.memo(NotificationEmptyState);
