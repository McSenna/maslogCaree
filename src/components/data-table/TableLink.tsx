import { Pressable, Text } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webStyle } from "@/theme/webStyle";

import { focusRing } from "./focusRing";
import { useCellSelfAlign } from "./TablePlacement";
import { TABLE_TEXT } from "./tableTokens";

type TableLinkProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

const POINTER = webStyle({ cursor: "pointer" });

/**
 * A record's name as its own control. Rows can also open on a pointer click;
 * this provides the same action for keyboard
 * and screen reader users, one tab stop per row.
 */
const TableLink = ({ label, onPress, accessibilityLabel, accessibilityHint }: TableLinkProps) => {
  const colors = useThemeColors();
  const { hovered, focused, pressed, handlers } = useInteractionState();
  const alignSelf = useCellSelfAlign();
  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={{ top: 8, bottom: 8 }}
      className="max-w-full"
      style={[POINTER, { alignSelf }, focused ? focusRing(colors.focusRing) : null]}
    >
      <Text
        numberOfLines={1}
        style={[
          TABLE_TEXT.primary,
          {
            color: hovered || pressed ? colors.primary : colors.heading,
            textDecorationLine: hovered ? "underline" : "none",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default TableLink;
