import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_TYPE } from "../config/profileTheme";

export type SettingsRowSize = "regular" | "large";

type SettingsRowProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  /** Trailing text before the chevron, e.g. an app version. */
  value?: string;
  onPress?: () => void;
  showDivider?: boolean;
  /**
   * "large" is the mobile treatment — taller row, tinted icon chip, bigger
   * label. "regular" keeps the web modal's denser list.
   */
  size?: SettingsRowSize;
};

const SIZES = {
  regular: { row: 48, chip: 0, icon: 18, label: PROFILE_TYPE.value, gap: 12 },
  large: { row: 56, chip: 36, icon: 17, label: 15, gap: 13 },
} as const;

/**
 * Icon | Label | Chevron row used by Account Settings and Help & Support.
 *
 * The mobile size wraps the glyph in a soft blue chip so the row reads as a
 * tappable object at arm's length; the divider is inset past that chip so the
 * list looks like one grouped card rather than stacked strips.
 */
const SettingsRow = ({
  label,
  icon,
  value,
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
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? `${label}, ${value}` : label}
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

          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: metrics.label,
              fontWeight: "600",
              letterSpacing: -0.1,
              color: PROFILE_COLORS.heading,
            }}
          >
            {label}
          </Text>

          {value ? (
            <Text
              maxFontSizeMultiplier={1.2}
              style={{ fontSize: PROFILE_TYPE.meta, color: PROFILE_COLORS.subtle }}
            >
              {value}
            </Text>
          ) : null}

          <Feather
            name="chevron-right"
            size={isLarge ? 19 : 18}
            color={PROFILE_COLORS.subtle}
          />
        </Animated.View>
      </Pressable>

      {showDivider ? (
        <View
          style={{
            height: 1,
            backgroundColor: PROFILE_COLORS.divider,
            // Inset past the icon so the rule starts under the label.
            marginLeft: isLarge ? metrics.chip + metrics.gap : 0,
          }}
        />
      ) : null}
    </View>
  );
};

export default SettingsRow;
