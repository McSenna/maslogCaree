import { Feather } from "@expo/vector-icons";
import { Animated, Pressable, Text } from "react-native";
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
  hint?: string;
  value?: string;
  badge?: string;
  /** One link standing alone, like About: accent icon and a section-weight label. */
  prominent?: boolean;
  showDivider?: boolean;
  onPress?: () => void;
};

const ROW_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color") });
const MIN_ROW_HEIGHT = 48;
const ICON_SIZE = 20;

const SettingsRow = ({
  label,
  icon,
  hint,
  value,
  badge,
  prominent = false,
  showDivider = false,
  onPress,
}: SettingsRowProps) => {
  const colors = useThemeColors();
  const { hovered, pressed, focused, scaleStyle, handlers } = useInteractionState({
    disabled: !onPress,
    pressScale: 0.99,
  });

  return (
    <Animated.View style={[scaleStyle, showDivider ? { borderBottomWidth: 1, borderBottomColor: colors.divider } : null]}>
      <Pressable
        {...handlers}
        accessibilityRole="button"
        accessibilityLabel={[label, badge, value].filter(Boolean).join(", ")}
        accessibilityHint={hint}
        onPress={onPress}
        disabled={!onPress}
        style={{
          minHeight: MIN_ROW_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.md,
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.sm,
          marginHorizontal: -SPACING.sm,
          borderRadius: RADII.small,
          backgroundColor: hovered || pressed ? colors.surfaceHover : "transparent",
          outlineWidth: focused ? 3 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
          ...ROW_WEB,
        }}
      >
        <Feather name={icon} size={ICON_SIZE} color={prominent ? colors.primary : colors.muted} />
        <Text
          style={{
            ...(prominent ? TYPE.bodyStrong : TYPE.body),
            flex: 1,
            minWidth: 0,
            color: prominent ? colors.heading : colors.body,
          }}
        >
          {label}
        </Text>
        <SettingsRowAccessory value={value} badge={badge} />
      </Pressable>
    </Animated.View>
  );
};

export default SettingsRow;
