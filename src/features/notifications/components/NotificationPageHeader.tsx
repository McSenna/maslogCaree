import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import StatePressable from "@/components/ui/StatePressable";
import { NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";
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
  // Opened directly with nothing unread, the row would hold nothing but its gap.
  const hasActions = Boolean(onBack) || unreadCount > 0;

  return (
    <View style={{ gap: 20, paddingBottom: 12, paddingTop: 8 }}>
      {/* No visible title (kape, 2026-11-07); the page keeps its heading for screen readers. */}
      <Text role="heading" aria-level={1} className="sr-only">
        Notifications
      </Text>

      {hasActions ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            {onBack ? (
              <StatePressable
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
              </StatePressable>
            ) : null}
          </View>

          <MarkAllReadButton unreadCount={unreadCount} onPress={onMarkAllRead} />
        </View>
      ) : null}

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
