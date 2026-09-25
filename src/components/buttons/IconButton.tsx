import { Feather } from "@expo/vector-icons";
import { Animated, Platform, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useHoverIntent } from "@/hooks/useHoverIntent";
import { useInteractionState } from "@/hooks/useInteractionState";
import FadeIn from "@/components/animations/FadeIn";
import { TIMING, webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { webStyle } from "@/theme/webStyle";

const ICON_BUTTON_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "border-color") });

const INVERSE_SOFT = "rgba(255,255,255,0.18)";

type IconButtonVariant = "ghost" | "outline" | "soft" | "solid";

type IconButtonProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: number;
  disabled?: boolean;
  tone?: "default" | "danger" | "inverse";
  showTooltip?: boolean;
  style?: StyleProp<ViewStyle>;
};

const IconButton = ({
  icon,
  label,
  onPress,
  variant = "ghost",
  size = 40,
  disabled = false,
  tone = "default",
  showTooltip = Platform.OS === "web",
  style,
}: IconButtonProps) => {
  const colors = useThemeColors();
  const { hovered, pressed, focused, scaleStyle, handlers } = useInteractionState({ disabled, pressScale: 0.96 });
  const showHoverTip = useHoverIntent(hovered);
  const active = hovered || pressed;
  const accent = tone === "danger" ? colors.danger.fg : colors.primary;

  const inverse = tone === "inverse";
  const softBackground = inverse ? INVERSE_SOFT : tone === "danger" ? colors.danger.bg : colors.primarySoft;

  const background =
    variant === "solid" ? accent
      : variant === "soft" || active ? softBackground
        : "transparent";
  const border = variant === "outline" ? (active ? accent : colors.border) : "transparent";
  const foreground = inverse ? "#FFFFFF" : variant === "solid" ? colors.onPrimary : active ? accent : colors.muted;

  return (
    <Animated.View style={[{ position: "relative" }, scaleStyle, style]}>
      <Pressable
        {...handlers}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        hitSlop={size < 44 ? (44 - size) / 2 : 0}
        style={{
          width: size,
          height: size,
          borderRadius: RADII.medium,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: background,
          borderWidth: 1,
          borderColor: border,
          opacity: disabled ? 0.45 : 1,
          outlineWidth: focused ? 3 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
          outlineOffset: 2,
          ...ICON_BUTTON_WEB,
        }}
      >
        <Feather name={icon} size={Math.round(size * 0.42)} color={foreground} />
      </Pressable>

      {showTooltip && (showHoverTip || focused) ? (
        <FadeIn
          offset={-3}
          duration={TIMING.hover}
          style={{ pointerEvents: "none", position: "absolute", top: size + 6, alignSelf: "center", zIndex: 50 }}
        >
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: RADII.small,
              backgroundColor: colors.scheme === "dark" ? "#E2E8F0" : "#0F172A",
            }}
          >
            <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: "500", color: colors.scheme === "dark" ? "#0F172A" : "#FFFFFF" }}>
              {label}
            </Text>
          </View>
        </FadeIn>
      ) : null}
    </Animated.View>
  );
};

export default IconButton;
