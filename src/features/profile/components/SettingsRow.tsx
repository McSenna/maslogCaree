import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_TYPE } from "../config/profileTheme";
import SettingsRowAccessory from "./settingsRow/SettingsRowAccessory";
import { USE_NATIVE_DRIVER } from "@/design/motion";

export type SettingsRowSize = "regular" | "large";

type SettingsRowProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  description?: string;
  value?: string;
  badge?: string;
  onPress?: () => void;
  showDivider?: boolean;
  size?: SettingsRowSize;
};

const SIZES = {
  regular: { row: 48, chip: 0, icon: 18, label: PROFILE_TYPE.value, gap: 12 },
  large: { row: 56, chip: 36, icon: 17, label: 15, gap: 13 },
} as const;

const SettingsRow = ({
  label,
  icon,
  description,
  value,
  badge,
  onPress,
  showDivider = true,
  size = "regular",
}: SettingsRowProps) => {
  const metrics = SIZES[size];
  const isLarge = size === "large";
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: USE_NATIVE_DRIVER,
      speed: 40,
      bounciness: 0,
    }).start();

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[label, description, badge, value].filter(Boolean).join(", ")}
        onPress={onPress}
        disabled={!onPress}
        onPressIn={() => animate(0.985)}
        onPressOut={() => animate(1)}
        className="justify-center active:opacity-60"
        style={{
          minHeight: metrics.row,
          paddingHorizontal: 8,
          marginHorizontal: -8,
          borderRadius: 14,
        }}
      >
        <Animated.View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: metrics.gap,
            paddingVertical: description ? 10 : 0,
            transform: [{ scale }],
          }}
        >
          {isLarge ? (
            <View
              style={{
                width: metrics.chip,
                height: metrics.chip,
                borderRadius: 11,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: PROFILE_COLORS.primarySoft,
              }}
            >
              <Feather name={icon} size={metrics.icon} color={PROFILE_COLORS.primary} />
            </View>
          ) : (
            <View style={{ width: 22, alignItems: "center" }}>
              <Feather name={icon} size={metrics.icon} color={PROFILE_COLORS.primary} />
            </View>
          )}

          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={{
                fontSize: metrics.label,
                fontWeight: "600",
                letterSpacing: -0.1,
                color: PROFILE_COLORS.heading,
              }}
            >
              {label}
            </Text>

            {description ? (
              <Text
                numberOfLines={2}
                maxFontSizeMultiplier={1.2}
                style={{ fontSize: PROFILE_TYPE.meta, lineHeight: 17, color: PROFILE_COLORS.muted }}
              >
                {description}
              </Text>
            ) : null}
          </View>

          <SettingsRowAccessory value={value} badge={badge} large={isLarge} />
        </Animated.View>
      </Pressable>

      {showDivider ? (
        <View
          style={{
            height: 1,
            backgroundColor: PROFILE_COLORS.divider,
            marginLeft: isLarge ? metrics.chip + metrics.gap : 0,
          }}
        />
      ) : null}
    </View>
  );
};

export default SettingsRow;
