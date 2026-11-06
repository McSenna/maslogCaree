import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";
import { formatUnreadStatus } from "../notification.utils";
import MarkAllReadButton from "./MarkAllReadButton";
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
    <View style={{ gap: 20, paddingBottom: 12, paddingTop: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                marginLeft: -10,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: NOTIFICATION_RADIUS.pill,
                backgroundColor: pressed ? palette.divider : "transparent",
              })}
            >
              <Feather name="arrow-left" size={22} color={palette.heading} />
            </Pressable>
          ) : null}

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              accessibilityRole="header"
              maxFontSizeMultiplier={1.3}
              style={{
                fontSize: 26,
                lineHeight: 31,
                fontWeight: "800",
                letterSpacing: -0.7,
                color: palette.heading,
              }}
            >
              Notifications
            </Text>

            <Text
              maxFontSizeMultiplier={1.3}
              style={{
                marginTop: 4,
                fontSize: 15,
                lineHeight: 21,
                color: palette.body,
              }}
            >
              {formatUnreadStatus(unreadCount)}
            </Text>
          </View>
        </View>

        <MarkAllReadButton unreadCount={unreadCount} onPress={onMarkAllRead} />
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
