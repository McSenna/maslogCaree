import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { NOTIFICATION_RADIUS, useNotificationPalette } from "../../notification.theme";
import type { NotificationFilter } from "../../notification.types";
import NotificationFilterTabs from "../NotificationFilterTabs";

type NotificationPanelHeaderProps = {
  unreadCount: number;
  totalCount: number;
  filter: NotificationFilter;
  onChangeFilter: (next: NotificationFilter) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
};

const NotificationPanelHeader = ({
  unreadCount,
  totalCount,
  filter,
  onChangeFilter,
  onMarkAllRead,
  onClose,
}: NotificationPanelHeaderProps) => {
  const palette = useNotificationPalette();

  return (
    <View
      style={{
        gap: 12,
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: palette.divider,
        backgroundColor: palette.surface,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            accessibilityRole="header"
            style={{ fontSize: 15.5, fontWeight: "800", letterSpacing: -0.2, color: palette.heading }}
          >
            Notifications
          </Text>
          <Text style={{ marginTop: 1, fontSize: 12, color: palette.muted }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </Text>
        </View>

        {unreadCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Mark all ${unreadCount} notifications as read`}
            onPress={onMarkAllRead}
            style={({ pressed }) => ({
              height: 32,
              paddingHorizontal: 11,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: NOTIFICATION_RADIUS.control,
              backgroundColor: palette.primarySoft,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: palette.primary }}>
              Mark all read
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
          onPress={onClose}
          hitSlop={6}
          style={({ pressed }) => ({
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: NOTIFICATION_RADIUS.pill,
            backgroundColor: pressed ? palette.divider : "transparent",
          })}
        >
          <Feather name="x" size={17} color={palette.muted} />
        </Pressable>
      </View>

      <NotificationFilterTabs
        value={filter}
        onChange={onChangeFilter}
        totalCount={totalCount}
        unreadCount={unreadCount}
        compact
      />
    </View>
  );
};

export default React.memo(NotificationPanelHeader);
