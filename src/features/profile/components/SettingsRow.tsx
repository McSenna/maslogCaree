import { Feather } from "@expo/vector-icons";
import { Animated, Pressable, Text, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";
import SettingsRowAccessory from "./settingsRow/SettingsRowAccessory";

type SettingsRowProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  description?: string;
  value?: string;
  badge?: string;
  onPress?: () => void;
};

const ROW_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color") });

const CHIP = 36;

const SettingsRow = ({ label, icon, description, value, badge, onPress }: SettingsRowProps) => {
  const colors = useThemeColors();
  const { hovered, pressed, focused, scaleStyle, handlers } = useInteractionState({
    disabled: !onPress,
    pressScale: 0.99,
  });

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        {...handlers}
        accessibilityRole="button"
        accessibilityLabel={[label, description, badge, value].filter(Boolean).join(", ")}
        onPress={onPress}
        disabled={!onPress}
        style={{
          minHeight: 52,
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.md,
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.sm,
          marginHorizontal: -SPACING.sm,
          borderRadius: RADII.medium,
          backgroundColor: hovered || pressed ? colors.surfaceHover : "transparent",
          outlineWidth: focused ? 3 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
          ...ROW_WEB,
        }}
      >
        <View
          style={{
            width: CHIP,
            height: CHIP,
            borderRadius: RADII.small,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surfaceMuted,
          }}
        >
          <Feather name={icon} size={17} color={colors.body} />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.bodyStrong, color: colors.heading }}>
            {label}
          </Text>

          {description ? (
            <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.caption, color: colors.muted }}>
              {description}
            </Text>
          ) : null}
        </View>

        <SettingsRowAccessory value={value} badge={badge} />
      </Pressable>
    </Animated.View>
  );
};

export default SettingsRow;
