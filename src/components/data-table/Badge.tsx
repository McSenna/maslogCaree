import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import { useCellSelfAlign } from "./TablePlacement";
import { TABLE_TEXT } from "./tableTokens";
import type { FeatherName } from "./types";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "progress";

/** A tone from a feature's own token map (roles, services, categories), for chips the status tones do not cover. */
export type BadgeColors = { bg: string; fg: string };

type BadgeProps = {
  tone: BadgeTone | BadgeColors;
  label: string;
  icon?: FeatherName;
  /** For icon sets other than Feather (role icons). Receives the tone's text colour and the icon size. */
  renderIcon?: (color: string, size: number) => ReactNode;
  /** Spoken before the label, e.g. "Account status" reads "Account status: Has account". */
  spokenAs?: string;
  /** Replaces the spoken label when the visible label is shorter than its meaning (role abbreviations). */
  accessibilityLabel?: string;
  size?: "sm" | "md";
};

/**
 * The one status chip: label on its tone's tint, with an icon so meaning never
 * rests on colour. The only fully rounded element in a table; it is not a button.
 */
const Badge = ({ tone, label, icon, renderIcon, spokenAs, accessibilityLabel, size = "sm" }: BadgeProps) => {
  const colors = useThemeColors();
  const { bg, fg } = typeof tone === "string" ? colors[tone] : tone;
  const large = size === "md";
  const alignSelf = useCellSelfAlign();
  const iconSize = large ? 14 : 12;

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? (spokenAs ? `${spokenAs}: ${label}` : label)}
      style={[styles.badge, large ? styles.large : styles.small, { alignSelf, backgroundColor: bg }]}
    >
      {icon ? <Feather name={icon} size={iconSize} color={fg} /> : null}
      {!icon && renderIcon ? renderIcon(fg, iconSize) : null}
      <Text numberOfLines={1} style={[large ? TABLE_TEXT.badgeLarge : TABLE_TEXT.badge, { color: fg }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: RADII.pill,
    maxWidth: "100%",
  },
  small: { height: 24, paddingHorizontal: 10 },
  large: { height: 28, paddingHorizontal: 12 },
});

export default Badge;
