import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Animated, Pressable, Text } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useInteractionState } from "@/hooks/useInteractionState";

type Variant = "primary" | "secondary" | "link";

type DashboardButtonProps = {
  palette: AdminDashboardPalette;
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Feather.glyphMap;
  /** Trailing icon, e.g. an arrow on "View all" links. */
  trailingIcon?: keyof typeof Feather.glyphMap;
  /** Hide the label visually (it is still the accessible name). */
  iconOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

const HEIGHT = 36;
const MIN_TARGET = 44;

/**
 * The one button used across the dashboards (refresh, retry, "View all"), so hover, keyboard focus,
 * pressed and disabled states look and behave the same on every dashboard.
 */
const DashboardButton = ({
  palette,
  label,
  onPress,
  variant = "secondary",
  icon,
  trailingIcon,
  iconOnly = false,
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
}: DashboardButtonProps) => {
  const inactive = disabled || loading;
  const { hovered, focused, pressed, scaleStyle, handlers } = useInteractionState({ disabled: inactive });

  const isLink = variant === "link";
  const isPrimary = variant === "primary";

  const foreground = isPrimary ? "#FFFFFF" : palette.primary;
  const background = isPrimary
    ? palette.primary
    : isLink
      ? hovered || pressed
        ? palette.tones.blue.cardBg
        : "transparent"
      : hovered || pressed
        ? palette.hoverBg
        : palette.cardBg;

  const content = loading ? (
    <ActivityIndicator size="small" color={foreground} />
  ) : icon ? (
    <Feather name={icon} size={15} color={foreground} />
  ) : null;

  return (
    <Animated.View style={[scaleStyle, { opacity: disabled ? 0.5 : 1 }]}>
      <Pressable
        {...handlers}
        onPress={onPress}
        disabled={inactive}
        accessibilityRole={isLink ? "link" : "button"}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: inactive, busy: loading }}
        hitSlop={(MIN_TARGET - HEIGHT) / 2}
        style={{
          height: HEIGHT,
          minWidth: iconOnly ? HEIGHT : undefined,
          paddingHorizontal: iconOnly ? 0 : isLink ? 8 : 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          borderRadius: 10,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: palette.cardBorder,
          backgroundColor: background,
          opacity: isPrimary && (hovered || pressed) ? 0.9 : 1,
          outlineWidth: focused ? 2 : 0,
          outlineStyle: "solid",
          outlineColor: palette.focusRing,
          outlineOffset: 2,
        }}
      >
        {content}
        {!iconOnly ? (
          <Text className="text-[13px] font-semibold" numberOfLines={1} style={{ color: foreground }}>
            {label}
          </Text>
        ) : null}
        {trailingIcon && !iconOnly ? <Feather name={trailingIcon} size={14} color={foreground} /> : null}
      </Pressable>
    </Animated.View>
  );
};

export default DashboardButton;
