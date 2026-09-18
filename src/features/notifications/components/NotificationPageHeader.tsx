import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";
import NotificationFilterTabs from "./NotificationFilterTabs";

type NotificationPageHeaderProps = {
  unreadCount: number;
  totalCount: number;
  filter: NotificationFilter;
  onChangeFilter: (next: NotificationFilter) => void;
  onMarkAllRead: () => void;
  onBack?: () => void;
};

const NotificationPageHeader = ({
  unreadCount,
  totalCount,
  filter,
  onChangeFilter,
  onMarkAllRead,
  onBack,
}: NotificationPageHeaderProps) => {
  const palette = useNotificationPalette();

  return (
    <View style={{ gap: 12, paddingBottom: 10, paddingTop: 4 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 36,
                height: 36,
                marginLeft: -4,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: NOTIFICATION_RADIUS.pill,
                backgroundColor: pressed ? palette.divider : "transparent",
              })}
            >
              <Feather name="arrow-left" size={20} color={palette.heading} />
            </Pressable>
          ) : null}

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              accessibilityRole="header"
              maxFontSizeMultiplier={1.3}
              style={{
                fontSize: 24,
                fontWeight: "700",
                letterSpacing: -0.4,
                color: palette.heading,
              }}
            >
              Notifications
            </Text>

            <Text
              maxFontSizeMultiplier={1.3}
              style={{
                marginTop: 2,
                fontSize: 13,
                fontWeight: "500",
                color: palette.muted,
              }}
            >
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                : "You're all caught up"}
            </Text>
          </View>
        </View>

        {unreadCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Mark all ${unreadCount} notifications as read`}
            onPress={onMarkAllRead}
            hitSlop={6}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 4.5,
              height: 32,
              paddingHorizontal: 9,
              borderRadius: 8,
              backgroundColor: pressed ? palette.primarySoft : "transparent",
            })}
          >
            <Feather name="check" size={13} color={palette.primary} />
            <Text
              maxFontSizeMultiplier={1.2}
              style={{
                fontSize: 12.5,
                fontWeight: "600",
                color: palette.primary,
              }}
            >
              Mark all as read
            </Text>
          </Pressable>
        ) : null}
      </View>

      <NotificationFilterTabs
        value={filter}
        onChange={onChangeFilter}
        totalCount={totalCount}
        unreadCount={unreadCount}
      />
    </View>
  );
};

export default React.memo(NotificationPageHeader);
