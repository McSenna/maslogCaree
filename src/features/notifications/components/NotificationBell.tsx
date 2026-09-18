import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { USE_NATIVE_DRIVER } from "@/design/motion";
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
  const [scale] = useState(() => new Animated.Value(1));

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();

    bellRef.current?.measureInWindow((x, y, width, height) => onMeasure({ x, y, width, height }));
    onPress();
  }, [onMeasure, onPress, scale]);

  const badge = unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : String(unreadCount);
  const offset = Math.max((hitSize - iconSize) / 2 - 5, 0);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        ref={bellRef}
        accessibilityRole="button"
        accessibilityLabel={
          unreadCount > 0 ? `Open notifications, ${unreadCount} unread` : "Open notifications"
        }
        onPress={handlePress}
        style={({ pressed }) => ({
          width: hitSize,
          height: hitSize,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: hitSize / 2,
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <Feather name="bell" size={iconSize} color={iconColor} />

        {unreadCount > 0 ? (
          indicator === "dot" ? (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{
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
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{
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
            </View>
          )
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(NotificationBell);
