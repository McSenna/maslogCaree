import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useCountBump } from "@/hooks/useCountBump";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useNotificationPalette } from "../notification.theme";
import type { BellPosition } from "../notification.types";

type NotificationBellProps = {
  unreadCount: number;
  onPress: () => void;
  onMeasure: (position: BellPosition) => void;
  indicator?: "count" | "dot";
  iconSize?: number;
  hitSize?: number;
  color?: string;
  ringColor?: string;
};

const MAX_BADGE = 99;
const MIN_TARGET = 44;
const HOVER_WASH = "rgba(148, 163, 184, 0.16)";

const NotificationBell = ({
  unreadCount,
  onPress,
  onMeasure,
  indicator = "count",
  iconSize = 20,
  hitSize = 40,
  color,
  ringColor,
}: NotificationBellProps) => {
  const palette = useNotificationPalette();
  const iconColor = color ?? palette.heading;
  const badgeRing = ringColor ?? palette.surface;
  const bellRef = useRef<View>(null);
  const bump = useCountBump(unreadCount);
  const { hovered, focused, scaleStyle, handlers } = useInteractionState({ pressScale: 0.94 });

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    bellRef.current?.measureInWindow((x, y, width, height) => onMeasure({ x, y, width, height }));
    onPress();
  }, [onMeasure, onPress]);

  const badge = unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : String(unreadCount);
  const offset = Math.max((hitSize - iconSize) / 2 - 5, 0);

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        ref={bellRef}
        {...handlers}
        hitSlop={hitSize < MIN_TARGET ? (MIN_TARGET - hitSize) / 2 : 0}
        accessibilityRole="button"
        accessibilityLabel={
          unreadCount > 0 ? `Open notifications, ${unreadCount} unread` : "Open notifications"
        }
        onPress={handlePress}
        style={{
          width: hitSize,
          height: hitSize,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: hitSize / 2,
          backgroundColor: hovered ? HOVER_WASH : "transparent",
          outlineWidth: focused ? 3 : 0,
          outlineStyle: "solid",
          outlineColor: palette.primary,
          outlineOffset: 1,
        }}
      >
        <Feather name="bell" size={iconSize} color={iconColor} />

        {unreadCount > 0 ? (
          indicator === "dot" ? (
            <Animated.View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{
                ...bump,
                position: "absolute",
                top: offset,
                right: offset,
                width: 8,
                height: 8,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: badgeRing,
                backgroundColor: palette.danger,
              }}
            />
          ) : (
            <Animated.View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{
                ...bump,
                position: "absolute",
                top: Math.max(offset - 3, 0),
                right: Math.max(offset - 5, 0),
                minWidth: 17,
                height: 17,
                paddingHorizontal: badge.length > 1 ? 4 : 0,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
                borderWidth: 1.5,
                borderColor: badgeRing,
                backgroundColor: palette.danger,
              }}
            >
              <Text allowFontScaling={false} style={{ fontSize: 9.5, fontWeight: "800", color: palette.onPrimary }}>
                {badge}
              </Text>
            </Animated.View>
          )
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(NotificationBell);
