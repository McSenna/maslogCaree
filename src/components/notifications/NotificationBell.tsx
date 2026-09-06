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
};

const NotificationBell = ({
  unreadCount,
  onPress,
  onMeasure,
}: NotificationBellProps) => {
  const { resolvedTheme, classes } = useTheme();
  const bellRef = useRef<View>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const iconColor =
    resolvedTheme === "dark" ? "#e2e8f0" : "#0f172a";

  const handlePress = useCallback(() => {
    // Haptic feedback
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Scale animation
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

    // Measure bell position for panel anchoring
    bellRef.current?.measureInWindow((x, y, width, height) => {
      onMeasure({ x, y, width, height });
    });

    onPress();
  }, [onPress, onMeasure, scaleAnim]);

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
        className={[
          "relative",
          "h-12",
          "w-12",
          "items-center",
          "justify-center",
          "rounded-2xl",
          classes.toolbarIcon,
        ].join(" ")}
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Feather name="bell" size={20} color={iconColor} />

        {unreadCount > 0 && (
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
        )}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(NotificationBell);
