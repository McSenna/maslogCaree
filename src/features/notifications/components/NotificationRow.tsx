import { Feather } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { NOTIFICATION_METRICS, NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { NotificationItem } from "../notification.types";
import {
  formatNotificationMessage,
  formatNotificationTime,
  resolveNotificationVisual,
} from "../notification.utils";

type NotificationRowProps = {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
  navigable?: boolean;
  compact?: boolean;
  /** Shared clock so every visible row re-computes "5 min ago" together. */
  now?: number;
};

const NotificationRow = ({
  item,
  onPress,
  navigable = false,
  compact = false,
  now,
}: NotificationRowProps) => {
  const palette = useNotificationPalette();
  const visual = resolveNotificationVisual(item, palette);
  const timestamp = formatNotificationTime(item, now);
  const displayBody = useMemo(() => formatNotificationMessage(item.body), [item.body]);
  const iconSize = compact ? NOTIFICATION_METRICS.compactIconSize : NOTIFICATION_METRICS.iconSize;

  const handlePress = useCallback(() => onPress(item), [item, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.isRead ? "Read" : "Unread"} notification. ${item.title}. ${displayBody}${timestamp ? `. ${timestamp}` : ""}`}
      accessibilityHint={navigable ? "Opens the related screen" : undefined}
      onPress={handlePress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "flex-start",
        gap: NOTIFICATION_METRICS.rowGap,
        paddingHorizontal: compact
          ? NOTIFICATION_METRICS.compactRowPaddingX
          : NOTIFICATION_METRICS.rowPaddingX,
        paddingVertical: compact
          ? NOTIFICATION_METRICS.compactRowPaddingY
          : NOTIFICATION_METRICS.rowPaddingY,
        backgroundColor: pressed
          ? palette.pressed
          : item.isRead
            ? "transparent"
            : palette.unreadSurface,
        borderBottomWidth: 1,
        borderBottomColor: palette.divider,
      })}
    >
      <View
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: NOTIFICATION_RADIUS.icon,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: visual.soft,
          flexShrink: 0,
        }}
      >
        <Feather name={visual.icon} size={compact ? 17 : 19} color={visual.color} />
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: compact ? 13.5 : 15,
              lineHeight: compact ? 18 : 20,
              fontWeight: item.isRead ? "600" : "700",
              color: palette.heading,
            }}
          >
            {item.title}
          </Text>

          {!item.isRead && (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: palette.unreadDot,
                flexShrink: 0,
              }}
            />
          )}
        </View>

        <Text
          numberOfLines={compact ? 2 : 3}
          maxFontSizeMultiplier={1.3}
          style={{
            marginTop: NOTIFICATION_METRICS.titleDescGap,
            fontSize: compact ? 12.5 : 13.5,
            lineHeight: compact ? 17 : 19,
            color: item.isRead ? palette.muted : palette.body,
          }}
        >
          {displayBody}
        </Text>

        {timestamp ? (
          <Text
            maxFontSizeMultiplier={1.3}
            style={{
              marginTop: NOTIFICATION_METRICS.descTimeGap,
              fontSize: compact ? 11.5 : 12,
              fontWeight: "500",
              color: palette.subtle,
            }}
          >
            {timestamp}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

export default React.memo(NotificationRow);
