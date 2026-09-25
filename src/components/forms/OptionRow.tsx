import { Feather } from "@expo/vector-icons";
import { Animated, Pressable, Text } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const ROW_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "border-color") });

const OptionRow = ({ label, selected, onPress, disabled = false }: OptionRowProps) => {
  const colors = useThemeColors();
  const { hovered, focused, scaleStyle, handlers } = useInteractionState({ disabled, pressScale: 0.99 });

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        {...handlers}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled }}
        style={[
          {
            minHeight: 44,
            flexDirection: "row",
            alignItems: "center",
            gap: SPACING.sm,
            paddingHorizontal: SPACING.md,
            borderRadius: RADII.medium,
            borderWidth: 1,
            borderColor: selected ? colors.primary : hovered ? colors.borderStrong : colors.border,
            backgroundColor: selected ? colors.primarySoft : hovered ? colors.surfaceHover : colors.surface,
            opacity: disabled ? 0.5 : 1,
            outlineWidth: focused ? 3 : 0,
            outlineColor: colors.focusRing,
            outlineStyle: "solid",
          },
          ROW_WEB,
        ]}
      >
        <Text style={[selected ? TYPE.bodyStrong : TYPE.body, { flex: 1, minWidth: 0, color: colors.heading }]}>
          {label}
        </Text>
        {selected ? <Feather name="check" size={16} color={colors.primary} /> : null}
      </Pressable>
    </Animated.View>
  );
};

export default OptionRow;
