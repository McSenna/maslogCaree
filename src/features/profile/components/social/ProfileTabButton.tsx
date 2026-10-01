import { Pressable, Text, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";
import type { ProfileTabDefinition } from "../../config/profileTabs";

type ProfileTabButtonProps = {
  tab: ProfileTabDefinition;
  active: boolean;
  compact: boolean;
  onPress: () => void;
};

const TAB_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "color") });

const INDICATOR = 3;

const ProfileTabButton = ({ tab, active, compact, onPress }: ProfileTabButtonProps) => {
  const colors = useThemeColors();
  const { hovered, pressed, focused, handlers } = useInteractionState();
  const highlighted = !active && (hovered || pressed);

  return (
    <Pressable
      {...handlers}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      aria-selected={active}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={{
        // Tabs share the row by label length, so "Overview" never truncates at 320px.
        flexGrow: compact ? 1 : 0,
        flexShrink: 1,
        minWidth: 0,
        minHeight: 52,
        paddingVertical: SPACING.xs,
        justifyContent: "center",
        outlineWidth: focused ? 3 : 0,
        outlineColor: colors.focusRing,
        outlineStyle: "solid",
        outlineOffset: -3,
        borderRadius: RADII.small,
        ...TAB_WEB,
      }}
    >
      <View
        style={{
          minHeight: 40,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: compact ? SPACING.xs : SPACING.lg,
          borderRadius: RADII.small,
          backgroundColor: highlighted ? colors.surfaceHover : "transparent",
          ...TAB_WEB,
        }}
      >
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
          style={{
            ...TYPE.bodyStrong,
            color: active ? colors.primary : colors.muted,
          }}
        >
          {compact ? tab.shortLabel : tab.label}
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          left: compact ? SPACING.xs : 0,
          right: compact ? SPACING.xs : 0,
          bottom: 0,
          height: INDICATOR,
          borderTopLeftRadius: INDICATOR,
          borderTopRightRadius: INDICATOR,
          backgroundColor: active ? colors.primary : "transparent",
        }}
      />
    </Pressable>
  );
};

export default ProfileTabButton;
