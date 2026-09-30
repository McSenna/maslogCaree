import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";
import type { AnnouncementTokenName } from "@/theme/announcementTokens";

import { useAnnouncementTheme } from "../../useAnnouncementTheme";

const STROKE = 1.9;

// Pressed and hovered only change colour: no scale, no lift.
const usePressLook = (disabled = false) => {
  const { hovered, pressed, handlers } = useInteractionState({ disabled, pressScale: 1 });
  return { active: !disabled && (hovered || pressed), handlers };
};

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  /** Wide layout: 40px tall, 14px text. Phones get 44px and 15px. */
  compact?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
};

export const PrimaryButton = ({ label, onPress, icon: Icon, compact, disabled, accessibilityHint }: ButtonProps) => {
  const { palette } = useAnnouncementTheme();
  const { active, handlers } = usePressLook(disabled);

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled) }}
      className={`${compact ? "min-h-10" : "min-h-11"} flex-row items-center justify-center gap-1.5 rounded-control px-3.5 web:cursor-pointer ${active ? "bg-brand-hover" : "bg-brand"} ${disabled ? "opacity-50" : ""}`}
    >
      {Icon ? <Icon size={16} color={palette["brand-on"]} strokeWidth={2} /> : null}
      <Text className={`font-ps-semibold text-brand-on ${compact ? "text-14" : "text-15"}`}>{label}</Text>
    </Pressable>
  );
};

type SecondaryButtonProps = ButtonProps & {
  tone?: "neutral" | "danger";
  /** Grow to share a row equally (phone Edit / Delete). */
  fill?: boolean;
};

export const SecondaryButton = ({
  label,
  onPress,
  icon: Icon,
  compact,
  disabled,
  accessibilityHint,
  tone = "neutral",
  fill,
}: SecondaryButtonProps) => {
  const { palette } = useAnnouncementTheme();
  const { active, handlers } = usePressLook(disabled);
  const danger = tone === "danger";
  const surface = active
    ? danger
      ? "bg-destructive-bg border-destructive-border"
      : "bg-neutral border-field"
    : "bg-canvas border-field";

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled) }}
      className={`${compact ? "min-h-10" : "min-h-11"} ${fill ? "flex-1" : ""} flex-row items-center justify-center gap-1.5 rounded-control border px-3.5 web:cursor-pointer ${surface} ${disabled ? "opacity-50" : ""}`}
    >
      {Icon ? <Icon size={16} color={danger ? palette.destructive : palette.ink} strokeWidth={STROKE} /> : null}
      <Text className={`font-ps-semibold text-14 ${danger ? "text-destructive" : "text-ink"}`}>{label}</Text>
    </Pressable>
  );
};

type IconButtonProps = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  size?: 40 | 44;
  iconSize?: number;
  bordered?: boolean;
  tone?: "neutral" | "danger";
  color?: AnnouncementTokenName;
  /** Turns the glyph upside down, for a chevron that shows open and closed. */
  flipped?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  accessibilityHint?: string;
};

export const IconButton = ({
  label,
  icon: Icon,
  onPress,
  size = 44,
  iconSize = 18,
  bordered,
  tone = "neutral",
  color = "text2",
  flipped,
  disabled,
  expanded,
  accessibilityHint,
}: IconButtonProps) => {
  const { palette } = useAnnouncementTheme();
  const { active, handlers } = usePressLook(disabled);
  const danger = tone === "danger";
  const surface = active ? (danger ? "bg-destructive-bg" : "bg-neutral") : "";
  const border = bordered ? (active && danger ? "border border-destructive-border" : "border border-field") : "";

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled), expanded }}
      // A 40px wide-layout button still offers a 44px touch target.
      hitSlop={size === 40 ? 2 : undefined}
      className={`${size === 40 ? "h-10 w-10" : "h-11 w-11"} items-center justify-center rounded-control web:cursor-pointer ${surface} ${border} ${disabled ? "opacity-50" : ""}`}
    >
      <View className={flipped ? "rotate-180" : ""}>
        <Icon size={iconSize} color={active && danger ? palette.destructive : palette[color]} strokeWidth={STROKE} />
      </View>
    </Pressable>
  );
};

export const TextButton = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const { active, handlers } = usePressLook();

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={8}
      className="min-h-11 justify-center px-1 web:cursor-pointer"
    >
      <Text className={`font-ps-semibold text-14 ${active ? "text-brand-hover underline" : "text-brand"}`}>{label}</Text>
    </Pressable>
  );
};
