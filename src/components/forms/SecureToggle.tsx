import { Feather } from "@expo/vector-icons";
import { Platform, Pressable } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { useInteractionState } from "@/hooks/useInteractionState";
import { RADII } from "@/theme/radius";
import { webStyle } from "@/theme/webStyle";

type SecureToggleProps = {
  revealed: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
  disabled?: boolean;
};

// A mouse press on the eye must not take focus from the input: the caret would
// jump, and the field would run its "left the field" check mid-typing.
const KEEP_INPUT_FOCUS =
  Platform.OS === "web" ? ({ onMouseDown: (event: { preventDefault: () => void }) => event.preventDefault() } as object) : {};

const TOGGLE_WEB = webStyle({ cursor: "pointer" });

/** The show/hide button inside a password field. A real toggle button, so it reports pressed state. */
const SecureToggle = ({ revealed, onToggle, showLabel, hideLabel, disabled = false }: SecureToggleProps) => {
  const colors = useThemeColors();
  const { focused, hovered, handlers } = useInteractionState({ disabled });

  return (
    <Pressable
      {...handlers}
      {...KEEP_INPUT_FOCUS}
      onPress={disabled ? undefined : onToggle}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={revealed ? hideLabel : showLabel}
      aria-pressed={revealed}
      accessibilityState={{ disabled }}
      hitSlop={4}
      className="h-11 w-11 items-center justify-center"
      style={[
        {
          borderRadius: RADII.small,
          backgroundColor: hovered ? colors.surfaceHover : "transparent",
          outlineWidth: focused ? 2 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
        },
        TOGGLE_WEB,
      ]}
    >
      <Feather name={revealed ? "eye-off" : "eye"} size={18} color={hovered ? colors.primary : colors.muted} />
    </Pressable>
  );
};

export default SecureToggle;
