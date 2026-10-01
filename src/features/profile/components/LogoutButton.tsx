import { Feather } from "@expo/vector-icons";
import { Animated, Pressable, Text } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

type LogoutButtonProps = {
  onPress: () => void;
};

const LOGOUT_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "border-color") });

const LogoutButton = ({ onPress }: LogoutButtonProps) => {
  const colors = useThemeColors();
  const { hovered, pressed, focused, scaleStyle, handlers } = useInteractionState();
  const active = hovered || pressed;

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        {...handlers}
        accessibilityRole="button"
        accessibilityLabel="Log out of MaslogCare"
        accessibilityHint="Asks you to confirm before signing out"
        onPress={onPress}
        style={{
          minHeight: 52,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          borderRadius: RADII.large,
          borderWidth: 1,
          borderColor: active ? colors.danger.border : colors.border,
          backgroundColor: active ? colors.danger.bg : colors.surface,
          outlineWidth: focused ? 3 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
          outlineOffset: 2,
          ...LOGOUT_WEB,
        }}
      >
        <Feather name="log-out" size={17} color={colors.danger.fg} />
        <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.bodyStrong, color: colors.danger.fg }}>
          Log out
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default LogoutButton;
