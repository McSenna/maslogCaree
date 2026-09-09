import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import type { BellPosition } from "./notification.types";

type NotificationBellProps = {
  unreadCount: number;
  onPress: () => void;
  onMeasure: (position: BellPosition) => void;
  variant?: "boxed" | "bare";
  indicator?: "count" | "dot";
  iconSize?: number;
  hitSize?: number;
  color?: string;
  dotRingColor?: string;
};

const DOT_COLOR = "#EF3340";

const NotificationBell = ({
  unreadCount,
  onPress,
  onMeasure,
  variant = "boxed",
  indicator = "count",
  iconSize = 20,
  hitSize = 48,
  color,
  dotRingColor = "#FFFFFF",
}: NotificationBellProps) => {
  const { resolvedTheme, classes } = useTheme();
  const bellRef = useRef<View>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const iconColor =
    color ?? (resolvedTheme === "dark" ? "#e2e8f0" : "#0f172a");

  const isBare = variant === "bare";

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    bellRef.current?.measureInWindow((x, y, width, height) => {
      onMeasure({ x, y, width, height });
    });

    onPress();
  }, [onPress, onMeasure, scaleAnim]);

  const dotSize = 8;
  const glyphInset = (hitSize - iconSize) / 2;
  const dotOffset = Math.max(glyphInset - dotSize / 2 - 1, 0);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        ref={bellRef}
        accessibilityRole="button"
        accessibilityLabel={
          unreadCount > 0
            ? `Open notifications, ${unreadCount} unread`
            : "Open notifications"
        }
        onPress={handlePress}
        className={
          isBare
            ? "relative items-center justify-center rounded-full"
            : [
                "relative",
                "h-12",
                "w-12",
                "items-center",
                "justify-center",
                "rounded-2xl",
                classes.toolbarIcon,
              ].join(" ")
        }
        style={({ pressed }) => [
          isBare ? { width: hitSize, height: hitSize } : null,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Feather name="bell" size={iconSize} color={iconColor} />

        {unreadCount > 0 &&
          (indicator === "dot" ? (
            <View
              accessibilityLabel={`${unreadCount} unread notifications`}
              style={{
                position: "absolute",
                top: dotOffset,
                right: dotOffset,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: DOT_COLOR,
                borderWidth: 1.5,
                borderColor: dotRingColor,
              }}
            />
          ) : (
            <View
              className="
                absolute
                -right-0.5
                -top-0.5
                min-h-[18px]
                min-w-[18px]
                items-center
                justify-center
                rounded-full
                bg-rose-500
                px-1
              "
              accessibilityLabel={`${unreadCount} unread notifications`}
            >
              <Text className="text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          ))}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(NotificationBell);
