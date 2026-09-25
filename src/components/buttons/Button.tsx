import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Animated, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { webStyle } from "@/theme/webStyle";
import {
  BUTTON_FONT,
  BUTTON_HEIGHT,
  BUTTON_ICON,
  BUTTON_PADDING_X,
  resolveButtonAppearance,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const BUTTON_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "border-color") });

const Button = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  loadingLabel,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
}: ButtonProps) => {
  const colors = useThemeColors();
  const inactive = disabled || loading;
  const { hovered, pressed, focused, scaleStyle, handlers } = useInteractionState({ disabled: inactive });
  const look = resolveButtonAppearance(variant, colors, { hovered, pressed, disabled: inactive });
  const isText = variant === "text";
  const iconNode = icon ? <Feather name={icon} size={BUTTON_ICON[size]} color={look.foreground} /> : null;

  return (
    <Animated.View style={[fullWidth ? { alignSelf: "stretch" } : { alignSelf: "flex-start" }, scaleStyle, style]}>
      <Pressable
        {...handlers}
        onPress={inactive ? undefined : onPress}
        disabled={inactive}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: inactive, busy: loading }}
        style={{
          minHeight: isText ? 36 : BUTTON_HEIGHT[size],
          paddingHorizontal: isText ? 4 : BUTTON_PADDING_X[size],
          borderRadius: RADII.medium,
          borderWidth: isText ? 0 : 1,
          borderColor: look.border,
          backgroundColor: look.background,
          opacity: disabled && !loading ? 0.5 : 1,
          alignItems: "center",
          justifyContent: "center",
          outlineWidth: focused ? 3 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
          outlineOffset: 2,
          ...BUTTON_WEB,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? <ActivityIndicator size="small" color={look.foreground} /> : iconPosition === "left" ? iconNode : null}
          <Text
            numberOfLines={1}
            style={{
              color: look.foreground,
              fontSize: BUTTON_FONT[size],
              fontWeight: "600",
              textDecorationLine: isText && hovered ? "underline" : "none",
            }}
          >
            {loading && loadingLabel ? loadingLabel : label}
          </Text>
          {!loading && iconPosition === "right" ? iconNode : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default Button;
