import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { REG_COLORS } from "../../registrationTheme";
import type { EmailActionState } from "./emailActionState";

type EmailActionSlotProps = {
  action: EmailActionState;
  onPress: () => void;
  height: number;
  minWidth: number;
  fontSize: number;
};

const TONE_COLORS = {
  idle: REG_COLORS.subtle,
  active: REG_COLORS.primary,
  busy: REG_COLORS.primary,
  verified: REG_COLORS.success,
} as const;

const EmailActionSlot = ({
  action,
  onPress,
  height,
  minWidth,
  fontSize,
}: EmailActionSlotProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const color = TONE_COLORS[action.tone];
  const interactive = !action.disabled;
  const highlight = interactive && (hovered || pressed);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel}
      accessibilityState={{ disabled: action.disabled, busy: action.tone === "busy" }}
      focusable={interactive}
      disabled={action.disabled}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        flexShrink: 0,
        height,
        minWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingHorizontal: 12,
        backgroundColor: highlight ? REG_COLORS.primarySoft : "transparent",
        opacity: pressed ? 0.85 : 1,
        ...Platform.select({
          web: {
            cursor: interactive ? "pointer" : "default",
            transition: "background-color 180ms ease",
          } as object,
        }),
      }}
    >
      {action.tone === "busy" ? (
        <ActivityIndicator size="small" color={color} />
      ) : action.icon ? (
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: REG_COLORS.secondarySoft,
          }}
        >
          <Feather name={action.icon} size={11} color={color} />
        </View>
      ) : null}

      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.15}
        style={{
          fontSize,
          fontWeight: "700",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color,
        }}
      >
        {action.label}
      </Text>
    </Pressable>
  );
};

export default EmailActionSlot;
