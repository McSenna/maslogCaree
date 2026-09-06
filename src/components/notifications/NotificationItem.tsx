import { Feather } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { NotificationItem as NotificationItemType } from "./notification.types";

type NotificationItemProps = {
  item: NotificationItemType;
  onPress: (id: string) => void;
};

// ── Icon & color mapping by tone ──────────────────────────────────────

const TONE_CONFIG = {
  info: {
    icon: "bell" as const,
    color: "#2563eb",
    bgLight: "bg-blue-50",
    bgDark: "bg-blue-500/15",
  },
  success: {
    icon: "check-circle" as const,
    color: "#16a34a",
    bgLight: "bg-green-50",
    bgDark: "bg-green-500/15",
  },
  warning: {
    icon: "alert-triangle" as const,
    color: "#f59e0b",
    bgLight: "bg-amber-50",
    bgDark: "bg-amber-500/15",
  },
} as const;

function getToneConfig(tone?: string) {
  if (tone && tone in TONE_CONFIG) {
    return TONE_CONFIG[tone as keyof typeof TONE_CONFIG];
  }
  return TONE_CONFIG.info;
}

// ── Component ─────────────────────────────────────────────────────────

const NotificationItem = ({ item, onPress }: NotificationItemProps) => {
  const { resolvedTheme, classes } = useTheme();
  const isDark = resolvedTheme === "dark";
  const config = getToneConfig(item.tone);

  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  // Unread styling
  const rowBg = !item.isRead
    ? isDark
      ? "bg-sky-500/5"
      : "bg-blue-50/60"
    : "";

  const borderClass = isDark
    ? "border-slate-800"
    : "border-slate-100";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Notification: ${item.title}`}
      onPress={handlePress}
      className={`flex-row items-start gap-3 border-b px-4 py-3 ${borderClass} ${rowBg}`}
      style={({ pressed }) => ({
        backgroundColor: pressed
          ? isDark
            ? "rgba(30,41,59,0.5)"
            : "rgba(241,245,249,1)"
          : undefined,
      })}
    >
      {/* Icon container */}
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${
          isDark ? config.bgDark : config.bgLight
        }`}
      >
        <Feather name={config.icon} size={18} color={config.color} />
      </View>

      {/* Text content */}
      <View className="min-w-0 flex-1">
        <Text
          className={`text-sm ${
            !item.isRead ? "font-bold" : "font-semibold"
          } ${classes.textPrimary}`}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <Text
          className={`mt-0.5 text-xs leading-relaxed ${classes.textMuted}`}
          numberOfLines={2}
        >
          {item.body}
        </Text>

        <Text
          className={`mt-1.5 text-[11px] font-semibold uppercase tracking-wider ${classes.textMuted}`}
        >
          {item.time}
        </Text>
      </View>

      {/* Unread dot indicator */}
      {!item.isRead && (
        <View className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
      )}
    </Pressable>
  );
};

export default React.memo(NotificationItem);
