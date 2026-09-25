import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Animated, Pressable, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

type PressableShellProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  radius?: number;
  showChevron?: boolean;
};

const PressableShell = ({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  radius = RADII.large,
  showChevron = true,
}: PressableShellProps) => {
  const colors = useThemeColors();
  const { hovered, focused, pressed, scaleStyle, handlers } = useInteractionState({ pressScale: 0.985 });
  const emphasised = hovered || focused || pressed;

  return (
    <Animated.View style={[{ flex: 1, minWidth: 0 }, scaleStyle]}>
      <Pressable
        {...handlers}
        onPress={onPress}
        accessibilityRole="link"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={{
          flex: 1,
          borderRadius: radius,
          outlineWidth: emphasised ? 2 : 0,
          outlineStyle: "solid",
          outlineColor: focused ? colors.focusRing : colors.primary,
          outlineOffset: focused ? 2 : -1,
        }}
      >
        {children}
        {showChevron ? (
          <View style={{ pointerEvents: "none", position: "absolute", right: 12, top: 12, opacity: emphasised ? 1 : 0.55 }}>
            <Feather name="arrow-right" size={14} color={colors.primary} />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export default PressableShell;
