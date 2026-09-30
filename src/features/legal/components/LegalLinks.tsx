import { Pressable, Text, View } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";

import { LEGAL_ROUTES } from "../legalContent";
import { showLegalDocument } from "../showLegalDocument";

type LegalLinksProps = {
  /** Overrides navigation, e.g. to open the document in a dialog over a form. */
  onOpen?: (kind: keyof typeof LEGAL_ROUTES) => void;
  align?: "left" | "center";
  color?: string;
};

const LINKS = [
  { kind: "privacy", label: "Privacy policy" },
  { kind: "terms", label: "Terms and conditions" },
] as const;

const LegalLink = ({
  label,
  color,
  focusRing,
  onPress,
}: {
  label: string;
  color: string;
  focusRing: string;
  onPress: () => void;
}) => {
  const { hovered, pressed, focused, handlers } = useInteractionState();

  return (
    <Pressable
      {...handlers}
      accessibilityRole="link"
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
      style={{
        opacity: pressed ? 0.7 : 1,
        borderRadius: 4,
        outlineWidth: focused ? 2 : 0,
        outlineStyle: "solid",
        outlineColor: focusRing,
        outlineOffset: 2,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "600", color, textDecorationLine: hovered ? "underline" : "none" }}>
        {label}
      </Text>
    </Pressable>
  );
};

/** The two legal links, for footers and settings screens. */
const LegalLinks = ({ onOpen, align = "center", color }: LegalLinksProps) => {
  const colors = useThemeColors();
  const tint = color ?? colors.primary;

  return (
    <View
      accessibilityRole="none"
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: 18,
        rowGap: 4,
      }}
    >
      {LINKS.map((link) => (
        <LegalLink
          key={link.kind}
          label={link.label}
          color={tint}
          focusRing={colors.focusRing}
          onPress={() => (onOpen ?? showLegalDocument)(link.kind)}
        />
      ))}
    </View>
  );
};

export default LegalLinks;
