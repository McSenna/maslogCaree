import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";

type NotificationFilterTabsProps = {
  value: NotificationFilter;
  onChange: (next: NotificationFilter) => void;
  totalCount: number;
  unreadCount: number;
  compact?: boolean;
};

const Tab = ({
  label,
  count,
  active,
  compact,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  compact: boolean;
  onPress: () => void;
}) => {
  const palette = useNotificationPalette();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={`${label}, ${count} notifications`}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: compact ? 30 : 34,
        paddingHorizontal: compact ? 12 : 14,
        borderRadius: NOTIFICATION_RADIUS.pill,
        backgroundColor: active ? palette.primarySoft : "rgba(148,163,184,0.08)",
        borderWidth: 1,
        borderColor: active ? "rgba(22,119,255,0.22)" : "transparent",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text
        maxFontSizeMultiplier={1.2}
        style={{
          fontSize: compact ? 12.5 : 13,
          fontWeight: active ? "700" : "500",
          color: active ? palette.primary : palette.muted,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          paddingHorizontal: 6,
          paddingVertical: 1.5,
          borderRadius: 10,
          backgroundColor: active ? "rgba(22,119,255,0.14)" : "rgba(148,163,184,0.15)",
        }}
      >
        <Text
          maxFontSizeMultiplier={1.2}
          style={{
            fontSize: 11,
            fontWeight: active ? "700" : "600",
            color: active ? palette.primary : palette.muted,
          }}
        >
          {count > 99 ? "99+" : count}
        </Text>
      </View>
    </Pressable>
  );
};

const NotificationFilterTabs = ({
  value,
  onChange,
  totalCount,
  unreadCount,
  compact = false,
}: NotificationFilterTabsProps) => {
  const selectAll = useCallback(() => onChange("all"), [onChange]);
  const selectUnread = useCallback(() => onChange("unread"), [onChange]);

  return (
    <View accessibilityRole="tablist" style={{ flexDirection: "row", gap: 8 }}>
      <Tab label="All" count={totalCount} active={value === "all"} compact={compact} onPress={selectAll} />
      <Tab
        label="Unread"
        count={unreadCount}
        active={value === "unread"}
        compact={compact}
        onPress={selectUnread}
      />
    </View>
  );
};

export default React.memo(NotificationFilterTabs);
