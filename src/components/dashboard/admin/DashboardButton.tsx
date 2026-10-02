import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Animated, Platform, Pressable, Text } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { dashboardButtonColors, type DashboardButtonVariant } from "./dashboardButtonColors";

type Variant = DashboardButtonVariant;

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
  /** "md" is the page-level action size (dashboard header); "sm" sits inside panels. */
  size?: "sm" | "md";
  /** Stretch across the parent (phone header actions). */
  fullWidth?: boolean;
};

const HEIGHTS = { sm: 36, md: 40 } as const;
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
  size = "sm",
  fullWidth = false,
}: DashboardButtonProps) => {
  const HEIGHT = HEIGHTS[size];
  const inactive = disabled || loading;
  const { hovered, focused, pressed, scaleStyle, handlers } = useInteractionState({ disabled: inactive });

  const isLink = variant === "link";
  const isPrimary = variant === "primary";
  const { foreground, background, border } = dashboardButtonColors(palette, variant, hovered || pressed);

  const content = loading ? (
    <ActivityIndicator size="small" color={foreground} />
  ) : icon ? (
    <Feather name={icon} size={15} color={foreground} />
  ) : null;

  return (
    <Animated.View
      style={[scaleStyle, { opacity: disabled ? 0.5 : 1 }, fullWidth ? { alignSelf: "stretch" } : null]}
    >
      <Pressable
        {...handlers}
        onPress={onPress}
        disabled={inactive}
        // react-native-web ignores Enter on role="link" without an href, so the web keeps "button".
        accessibilityRole={isLink && Platform.OS !== "web" ? "link" : "button"}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: inactive, busy: loading }}
        hitSlop={Math.max(0, (MIN_TARGET - HEIGHT) / 2)}
        style={{
          height: HEIGHT,
          minWidth: iconOnly ? HEIGHT : undefined,
          paddingHorizontal: iconOnly ? 0 : isLink ? 8 : size === "md" ? 16 : 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          borderRadius: 10,
          borderWidth: border ? 1 : 0,
          borderColor: border ?? undefined,
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
          <Text
            className={size === "md" ? "text-[14px] font-semibold" : "text-[13px] font-semibold"}
            numberOfLines={1}
            style={{ color: foreground }}
          >
            {label}
          </Text>
        ) : null}
        {trailingIcon && !iconOnly ? <Feather name={trailingIcon} size={14} color={foreground} /> : null}
      </Pressable>
    </Animated.View>
  );
};

export default DashboardButton;
