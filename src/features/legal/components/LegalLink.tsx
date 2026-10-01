import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, Text, View } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";
import { RADII } from "@/theme/radius";
import { TYPE } from "@/theme/typography";

type LegalLinkProps = {
  label: string;
  color: string;
  focusRing: string;
  onPress: () => void;
  /**
   * A link on its own line gets a full 44px target and a trailing arrow.
   * Links set in a row keep their text height, so footers do not grow, and
   * reach 44px through hitSlop instead.
   */
  standalone?: boolean;
};

// 13px above and below the 18px label line makes the 44px minimum touch target.
const ROW_HIT_SLOP = { top: 13, bottom: 13, left: 6, right: 6 };

// On web these open or switch a dialog in place, which is a button's job, and
// react-native-web only runs onPress for Enter on real <a href> links, so a
// role="link" div ignored the keyboard. In the app they open a page: a link.
const ROLE = Platform.OS === "web" ? "button" : "link";

const LINK_FRAME = {
  borderRadius: RADII.small,
  outlineStyle: "solid",
  outlineOffset: 2,
} as const;

const LegalLink = ({ label, color, focusRing, onPress, standalone = false }: LegalLinkProps) => {
  const { hovered, pressed, focused, handlers } = useInteractionState();

  return (
    <Pressable
      {...handlers}
      accessibilityRole={ROLE}
      onPress={onPress}
      hitSlop={standalone ? undefined : ROW_HIT_SLOP}
      className={standalone ? "min-h-11 flex-row items-center gap-2 self-start" : "flex-row items-center"}
      // 3px ring on keyboard focus, the same as Button and Card.
      style={[LINK_FRAME, { opacity: pressed ? 0.7 : 1, outlineWidth: focused ? 3 : 0, outlineColor: focusRing }]}
    >
      <Text
        style={[
          standalone ? TYPE.bodyStrong : TYPE.label,
          { color, textDecorationLine: hovered ? "underline" : "none" },
        ]}
      >
        {label}
      </Text>
      {standalone ? (
        <View aria-hidden>
          <Feather name="arrow-right" size={16} color={color} />
        </View>
      ) : null}
    </Pressable>
  );
};

export default LegalLink;
