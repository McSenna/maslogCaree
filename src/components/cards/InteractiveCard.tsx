import type { ReactNode } from "react";
import { Animated, Pressable, View, type ViewStyle } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webStyle } from "@/theme/webStyle";

type InteractiveCardProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  /** The card that matches what the list below is showing. */
  selected?: boolean;
  radius: number;
  /** Layout for the card's slot, e.g. flex-basis in a wrapping row; defaults to an equal share. */
  containerStyle?: ViewStyle;
};

const CURSOR = webStyle({ cursor: "pointer" });

/**
 * Makes a summary card a button without touching its own design: a ring in
 * the console colours on hover, a solid ring while it is the active filter,
 * the focus ring for keyboard users, and a slight press. The rings are an
 * overlay, so the card keeps its size and native gets the same selected ring.
 */
const InteractiveCard = ({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  selected = false,
  radius,
  containerStyle = { flex: 1, minWidth: 0 },
}: InteractiveCardProps) => {
  const palette = useAdminSurfacePalette();
  const { hovered, focused, pressed, scaleStyle, handlers } = useInteractionState({ pressScale: 0.985 });

  const ring = focused
    ? { width: 2, color: palette.focusRing }
    : selected
      ? { width: 2, color: palette.primary }
      : hovered || pressed
        ? { width: 1.5, color: palette.bannerBorder }
        : null;

  return (
    <Animated.View style={[containerStyle, scaleStyle]}>
      <Pressable
        {...handlers}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ selected }}
        aria-selected={selected}
        style={[{ flex: 1, borderRadius: radius }, CURSOR]}
      >
        {children}
        {ring ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              borderRadius: radius,
              borderWidth: ring.width,
              borderColor: ring.color,
            }}
          />
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export default InteractiveCard;
