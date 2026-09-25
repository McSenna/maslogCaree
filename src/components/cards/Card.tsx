import type { ReactNode } from "react";
import { Animated, Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useInteractionState } from "@/hooks/useInteractionState";
import { RADII } from "@/theme/radius";
import { webTransition } from "@/theme/motion";
import { SHADOWS } from "@/theme/shadows";
import { SPACING, type SpacingToken } from "@/theme/spacing";
import { webStyle } from "@/theme/webStyle";

const CARD_WEB = webStyle({ cursor: "pointer", transition: webTransition("border-color", "box-shadow") });

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  padding?: SpacingToken;
  elevated?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useCardSurface = (padding: SpacingToken, elevated: boolean): ViewStyle => {
  const colors = useThemeColors();
  return {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: RADII.large,
    padding: SPACING[padding],
    ...(elevated ? SHADOWS.card : null),
  };
};

const InteractiveCard = ({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  padding = "lg",
  elevated = true,
  selected = false,
  style,
}: CardProps & { onPress: () => void }) => {
  const colors = useThemeColors();
  const surface = useCardSurface(padding, elevated);
  const { hovered, focused, pressed, scaleStyle, handlers } = useInteractionState({ pressScale: 0.985 });
  const emphasised = hovered || focused || pressed || selected;

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        {...handlers}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ selected }}
        style={[
          surface,
          CARD_WEB,
          emphasised ? { borderColor: colors.primary } : null,
          hovered ? SHADOWS.raised : null,
          focused ? { outlineWidth: 3, outlineColor: colors.focusRing, outlineStyle: "solid", outlineOffset: 2 } : null,
          style,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const StaticCard = ({ children, padding = "lg", elevated = true, style }: CardProps) => {
  const surface = useCardSurface(padding, elevated);
  return <View style={[surface, style]}>{children}</View>;
};

const Card = (props: CardProps) =>
  props.onPress ? <InteractiveCard {...props} onPress={props.onPress} /> : <StaticCard {...props} />;

export default Card;
