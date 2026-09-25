import { useState, type Ref } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { REG_COLORS, REG_METRICS, REG_RADIUS } from "../../registrationTheme";

type LinkButtonProps = {
  label: string;
  accessibilityLabel?: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
};

export const LinkButton = ({ label, accessibilityLabel, icon, onPress }: LinkButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      hitSlop={4}
      style={({ pressed }) => ({
        minHeight: REG_METRICS.touchTarget,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        opacity: pressed ? 0.7 : 1,
        ...Platform.select({ web: { cursor: "pointer" } as object }),
      })}
    >
      <Feather name={icon} size={14} color={REG_COLORS.primary} />
      <Text
        style={{
          fontSize: 13.5,
          fontWeight: "600",
          color: REG_COLORS.primary,
          textDecorationLine: hovered ? "underline" : "none",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  height: number;
  busy?: boolean;
  busyLabel?: string;
  reducedMotion: boolean;
  buttonRef?: Ref<View>;
};

export const PrimaryButton = ({
  label,
  onPress,
  height,
  busy = false,
  busyLabel,
  reducedMotion,
  buttonRef,
}: PrimaryButtonProps) => (
  <Pressable
    ref={buttonRef}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled: busy, busy }}
    disabled={busy}
    onPress={onPress}
    style={({ pressed, hovered }) => ({
      height: Math.max(height, REG_METRICS.touchTarget),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: REG_RADIUS.control,
      backgroundColor: REG_COLORS.primary,
      opacity: busy ? 0.7 : pressed ? 0.88 : hovered ? 0.94 : 1,
      ...Platform.select({
        web: {
          cursor: busy ? "progress" : "pointer",
          transition: reducedMotion ? "none" : "opacity 150ms ease",
        } as object,
      }),
    })}
  >
    {busy ? <ActivityIndicator size="small" color={REG_COLORS.surface} /> : null}
    <Text style={{ fontSize: 15, fontWeight: "700", color: REG_COLORS.surface }}>
      {busy && busyLabel ? busyLabel : label}
    </Text>
  </Pressable>
);
