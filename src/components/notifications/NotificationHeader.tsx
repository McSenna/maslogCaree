import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type NotificationHeaderProps = {
  unreadCount: number;
  hasItems: boolean;
  onMarkAllRead: () => void;
  onClose: () => void;
};

const NotificationHeader = ({
  unreadCount,
  hasItems,
  onMarkAllRead,
  onClose,
}: NotificationHeaderProps) => {
  const { resolvedTheme, classes } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={`border-b px-4 pb-3 pt-4 ${
        isDark ? "border-slate-700/60" : "border-slate-100"
      }`}
    >
      {/* Top row: title + close */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className={`text-lg font-bold tracking-tight ${classes.textPrimary}`}
          >
            Notifications
          </Text>

          {unreadCount > 0 && (
            <Text
              className={`mt-0.5 text-xs font-medium ${classes.textMuted}`}
            >
              {unreadCount} unread
            </Text>
          )}
        </View>

        <View className="flex-row items-center gap-2">
          {/* Mark all as read */}
          {hasItems && unreadCount > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
              onPress={onMarkAllRead}
              className={`rounded-full border px-3 py-1.5 active:opacity-80 ${
                isDark
                  ? "border-slate-600/50 bg-slate-800/60"
                  : "border-slate-200 bg-white"
              }`}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                className={`text-xs font-semibold ${classes.textAccent}`}
              >
                Mark all as read
              </Text>
            </Pressable>
          )}

          {/* Close button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close notifications"
            onPress={onClose}
            className="rounded-full p-1.5 active:opacity-70"
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather
              name="x"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default React.memo(NotificationHeader);
