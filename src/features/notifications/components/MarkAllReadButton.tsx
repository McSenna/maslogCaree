import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useNotificationPalette } from "../notification.theme";

type MarkAllReadButtonProps = {
  unreadCount: number;
  onPress: () => void;
};

/** Shown only while something is unread; used by the inbox page and the web modal. */
const MarkAllReadButton = ({ unreadCount, onPress }: MarkAllReadButtonProps) => {
  const palette = useNotificationPalette();
  const { focusRing } = useThemeColors();
  const { hovered, focused, handlers } = useInteractionState({ pressScale: 1 });

  if (unreadCount === 0) return null;

  return (
    <Pressable
      {...handlers}
      accessibilityRole="button"
      accessibilityLabel={`Mark all ${unreadCount} notifications as read`}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 4.5,
        height: 32,
        paddingHorizontal: 9,
        borderRadius: 8,
        backgroundColor: pressed || hovered ? palette.primarySoft : "transparent",
        outlineWidth: focused ? 2 : 0,
        outlineOffset: 2,
        outlineColor: focusRing,
        outlineStyle: "solid",
      })}
    >
      <Feather name="check" size={13} color={palette.primary} />
      <Text maxFontSizeMultiplier={1.2} style={{ fontSize: 14.5, fontWeight: "600", color: palette.primary }}>
        Mark all as read
      </Text>
    </Pressable>
  );
};

export default React.memo(MarkAllReadButton);
