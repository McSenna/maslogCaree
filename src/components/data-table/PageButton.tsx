import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { focusRing } from "./focusRing";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { webStyle } from "@/theme/webStyle";

import { ROW_HOVER_MS, TABLE_TEXT, TAP_TARGET } from "./tableTokens";

type PageButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  /** A page number, or an arrow for previous and next. */
  page?: number;
  arrow?: "prev" | "next";
  /** Text beside the arrow on phones ("Previous", "Next"). */
  arrowLabel?: string;
  current?: boolean;
  disabled?: boolean;
};

const WEB = webStyle({
  cursor: "pointer",
  transition: `background-color ${ROW_HOVER_MS}ms ease-out`,
});

/** A 32px square page control; with `arrowLabel` it is the 44px phone step button. */
const PageButton = ({
  onPress,
  accessibilityLabel,
  page,
  arrow,
  arrowLabel,
  current = false,
  disabled = false,
}: PageButtonProps) => {
  const colors = useThemeColors();
  const { hovered, focused, pressed, handlers } = useInteractionState({
    disabled: disabled || current,
  });
  const isArrow = arrow !== undefined;
  const foreground = current ? colors.onPrimary : colors.body;
  const background = current ? colors.primary : hovered || pressed ? colors.surfaceMuted : "transparent";

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected: current }}
      aria-current={current ? "page" : undefined}
      style={[
        styles.base,
        arrowLabel ? styles.step : styles.square,
        {
          backgroundColor: background,
          borderColor: isArrow ? colors.border : "transparent",
          opacity: disabled ? 0.4 : 1,
        },
        focused
          ? focusRing(colors.focusRing)
          : null,
        WEB,
      ]}
    >
      {arrow === "prev" ? <Feather name="chevron-left" size={16} color={foreground} /> : null}
      {arrowLabel ? <Text style={[TABLE_TEXT.button, { color: foreground }]}>{arrowLabel}</Text> : null}
      {arrow === "next" ? <Feather name="chevron-right" size={16} color={foreground} /> : null}
      {isArrow ? null : <Text style={[TABLE_TEXT.button, { color: foreground }]}>{page}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: RADII.small,
  },
  square: { minWidth: 32, height: 32, paddingHorizontal: 4 },
  step: { height: TAP_TARGET, paddingHorizontal: 16 },
});

export default PageButton;
