import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text } from "react-native";

import { focusRing } from "./focusRing";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { webStyle } from "@/theme/webStyle";

import { tableButtonColors, type TableButtonTone, type TableButtonVariant } from "./tableButtonColors";
import { useTablePlacement } from "./TablePlacement";
import { CONTROL_HEIGHT, ROW_HOVER_MS, TABLE_TEXT, TAP_TARGET } from "./tableTokens";
import type { FeatherName } from "./types";

type TableButtonProps = {
  label: string;
  onPress: () => void;
  /** Include the record, e.g. "Edit Juan Dela Cruz", so the action is clear out of context. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  variant?: TableButtonVariant;
  tone?: TableButtonTone;
  icon?: FeatherName;
  /** Show only the icon; `label` is still the tooltip and the fallback name. */
  iconOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Comfortable controls retain a 44px target inside desktop tables. */
  size?: "default" | "comfortable";
  /** DOM id on web, so a dialog can hand focus back to the button that opened it. */
  nativeID?: string;
};

const WEB = webStyle({
  cursor: "pointer",
  transition: ["background-color", "border-color", "color"].map((p) => `${p} ${ROW_HOVER_MS}ms ease-out`).join(", "),
});

/**
 * A row action. 36px in the table; on phone cards it grows to a full-width 44px target.
 * Outlined for the main action, text for secondary ones, primary for a decision.
 */
const TableButton = ({
  label,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  variant = "outlined",
  tone = "default",
  icon,
  iconOnly = false,
  disabled = false,
  loading = false,
  size = "default",
  nativeID,
}: TableButtonProps) => {
  const colors = useThemeColors();
  const onCard = useTablePlacement() === "card";
  const inactive = disabled || loading;
  const { hovered, focused, pressed, handlers } = useInteractionState({
    disabled: inactive,
  });
  const { foreground, background, border } = tableButtonColors(colors, variant, tone, hovered || pressed);
  const controlSize = onCard || size === "comfortable" ? TAP_TARGET : CONTROL_HEIGHT;
  const bare = variant === "text" && !onCard;

  const button = (
    <Pressable
      {...handlers}
      nativeID={nativeID}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      aria-busy={loading}
      hitSlop={bare ? { top: 4, bottom: 4, left: 8, right: 8 } : undefined}
      style={[
        styles.base,
        {
          height: controlSize,
          minHeight: controlSize,
          backgroundColor: background,
          borderColor: border,
          opacity: inactive ? 0.4 : pressed ? 0.8 : 1,
        },
        iconOnly ? { width: controlSize } : bare ? styles.bare : styles.padded,
        onCard && !iconOnly ? styles.fill : null,
        focused
          ? focusRing(colors.focusRing, iconOnly ? -2 : 2)
          : null,
        WEB,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={foreground} /> : null}
      {!loading && icon ? <Feather name={icon} size={14} color={foreground} /> : null}
      {iconOnly ? null : <Text style={[TABLE_TEXT.button, { color: foreground }]}>{label}</Text>}
    </Pressable>
  );

  // React Native Web filters `title` on Pressable, so use the existing DOM hint pattern.
  return Platform.OS === "web" && iconOnly ? <div title={accessibilityLabel}>{button}</div> : button;
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: RADII.small,
  },
  padded: { paddingHorizontal: 14 },
  // Text buttons in a row start exactly at their column's edge; hitSlop keeps the target generous.
  bare: { paddingHorizontal: 0, borderWidth: 0 },
  fill: { flexGrow: 1, flexBasis: 0 },
});

export default TableButton;
