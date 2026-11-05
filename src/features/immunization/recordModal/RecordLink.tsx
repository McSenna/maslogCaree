import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webStyle } from "@/theme/webStyle";

import useRecordModalStyles from "./recordModalStyles";

const POINTER = webStyle({ cursor: "pointer" });
const ICON_SIZE = 16;
// Keeps a 44px touch target around a single line of link text.
const TOUCH_SLOP = { top: 12, bottom: 12 };

type RecordLinkProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  chevron?: boolean;
};

// A button with a link's look: it runs a callback and goes nowhere by itself,
// and role="link" without an href would ignore Enter on web.
const RecordLink = ({ label, onPress, accessibilityLabel, chevron = false }: RecordLinkProps) => {
  const { colors, styles } = useRecordModalStyles();
  const { hovered, pressed, focused, handlers } = useInteractionState();
  const color = hovered || pressed ? colors.primaryHover : colors.primary;
  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={TOUCH_SLOP}
      style={[styles.link, POINTER, focused ? focusRing(colors.focusRing) : null]}
    >
      <Text style={[styles.linkText, { color, textDecorationLine: hovered ? "underline" : "none" }]}>{label}</Text>
      {chevron ? <Feather name="chevron-right" size={ICON_SIZE} color={color} /> : null}
    </Pressable>
  );
};

export default RecordLink;
