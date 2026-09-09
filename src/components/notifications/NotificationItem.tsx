import { Feather } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { NotificationItem as NotificationItemType } from "./notification.types";

type NotificationItemProps = {
  item: NotificationItemType;
  onPress: (id: string) => void;
  /**
   * "row" is the dropdown panel's divided list; "card" is the standalone
   * notifications screen, where each entry is its own rounded surface.
   */
  variant?: "row" | "card";
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

const NotificationItem = ({
  item,
  onPress,
  variant = "row",
}: NotificationItemProps) => {
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

  const isCard = variant === "card";

  // Press feedback rides on the class, not on a style callback: a function-form
  // `style` on Pressable is dropped here, taking the surface with it.
  const shape = isCard
    ? `rounded-2xl border px-4 py-3.5 ${borderClass} ${rowBg || (isDark ? "bg-slate-900" : "bg-white")}`
    : `border-b px-4 py-3 ${borderClass} ${rowBg}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Notification: ${item.title}`}
      accessibilityHint={item.isRead ? "Read" : "Unread"}
      accessibilityState={{ selected: !item.isRead }}
      onPress={handlePress}
      className={`flex-row items-start gap-3 active:opacity-80 ${shape}`}
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
          numberOfLines={isCard ? 2 : 1}
        >
          {item.title}
        </Text>

        <Text
          className={`mt-0.5 text-xs leading-relaxed ${classes.textMuted}`}
          numberOfLines={isCard ? undefined : 2}
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
