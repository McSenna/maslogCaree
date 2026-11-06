import { Feather } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { NOTIFICATION_METRICS, NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { NotificationItem } from "../notification.types";
import { formatNotificationRowBody, formatNotificationTime, resolveNotificationVisual } from "../notification.utils";

type NotificationRowProps = {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
  navigable?: boolean;
  compact?: boolean;
  /** Shared clock so every visible row re-computes "5 min ago" together. */
  now?: number;
  /** Draws the rule above this row; false for the first row of each date group. */
  divided?: boolean;
};

const NotificationRow = ({
  item,
  onPress,
  navigable = false,
  compact = false,
  now,
  divided = false,
}: NotificationRowProps) => {
  const palette = useNotificationPalette();
  const { focusRing } = useThemeColors();
  const { hovered, focused, handlers } = useInteractionState({ pressScale: 1 });
  const visual = resolveNotificationVisual(item, palette);
  const timestamp = formatNotificationTime(item, now);
  const displayBody = useMemo(() => formatNotificationRowBody(item, compact), [compact, item]);
  const iconSize = compact ? NOTIFICATION_METRICS.compactIconSize : NOTIFICATION_METRICS.iconSize;
  const paddingX = compact ? NOTIFICATION_METRICS.compactRowPaddingX : NOTIFICATION_METRICS.rowPaddingX;

  const handlePress = useCallback(() => onPress(item), [item, onPress]);

  return (
    <View>
      {divided ? (
        <View
          style={{
            height: 1,
            marginLeft: paddingX + iconSize + NOTIFICATION_METRICS.rowGap,
            marginRight: paddingX,
            backgroundColor: palette.divider,
          }}
        />
      ) : null}

      <Pressable
        {...handlers}
        accessibilityRole="button"
        accessibilityLabel={`${item.isRead ? "Read" : "Unread"} notification. ${item.title}. ${displayBody}${timestamp ? `. ${timestamp}` : ""}`}
        accessibilityHint={
          navigable
            ? visual.category === "announcement"
              ? "Opens the announcement details"
              : "Opens the related screen"
            : undefined
        }
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "flex-start",
          gap: NOTIFICATION_METRICS.rowGap,
          paddingHorizontal: paddingX,
          paddingVertical: compact ? NOTIFICATION_METRICS.compactRowPaddingY : NOTIFICATION_METRICS.rowPaddingY,
          backgroundColor: pressed || hovered ? palette.pressed : "transparent",
          outlineWidth: focused ? 2 : 0,
          outlineOffset: -2,
          outlineColor: focusRing,
          outlineStyle: "solid",
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
          <Feather name={visual.icon} size={compact ? 18 : 22} color={visual.color} />
        </View>

        <View style={{ flex: 1, minWidth: 0, paddingTop: compact ? 0 : 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={{
                flexShrink: 1,
                minWidth: 0,
                fontSize: compact ? 15.5 : 17,
                lineHeight: compact ? 20 : 22,
                fontWeight: "700",
                letterSpacing: -0.15,
                color: palette.heading,
              }}
            >
              {item.title}
            </Text>

            {!item.isRead && (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.unreadDot, flexShrink: 0 }}
              />
            )}
          </View>

          <Text
            numberOfLines={compact ? 2 : 3}
            maxFontSizeMultiplier={1.3}
            style={{
              marginTop: NOTIFICATION_METRICS.titleDescGap,
              fontSize: compact ? 14.5 : 15.5,
              lineHeight: compact ? 19 : 21,
              color: palette.body,
            }}
          >
            {displayBody}
          </Text>

          {timestamp ? (
            <Text
              maxFontSizeMultiplier={1.3}
              style={{ marginTop: NOTIFICATION_METRICS.descTimeGap, fontSize: compact ? 13.5 : 14, color: palette.muted }}
            >
              {timestamp}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
};

export default React.memo(NotificationRow);
