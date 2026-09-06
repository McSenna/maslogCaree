import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type NotificationErrorStateProps = {
  message?: string;
  onRetry: () => void;
};

const NotificationErrorState = ({
  message = "Unable to load notifications.",
  onRetry,
}: NotificationErrorStateProps) => {
  const { resolvedTheme, classes } = useTheme();

  const iconBg =
    resolvedTheme === "dark" ? "bg-rose-500/15" : "bg-rose-50";

  return (
    <View className="items-center justify-center px-6 py-12">
      <View
        className={`mb-4 h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
      >
        <Feather name="alert-circle" size={24} color="#ef4444" />
      </View>

      <Text
        className={`mb-3 text-center text-sm ${classes.textMuted}`}
      >
        {message}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retry loading notifications"
        onPress={onRetry}
        className={`rounded-full border px-5 py-2 active:opacity-80 ${classes.border}`}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text className={`text-sm font-semibold ${classes.textAccent}`}>
          Try Again
        </Text>
      </Pressable>
    </View>
  );
};

export default React.memo(NotificationErrorState);
