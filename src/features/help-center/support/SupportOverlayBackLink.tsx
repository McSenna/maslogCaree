import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import { useResidentDialogPalette } from "@/design/residentDialogTheme";

type SupportOverlayBackLinkProps = {
  label: string;
  onPress: () => void;
};

const SupportOverlayBackLink = ({ label, onPress }: SupportOverlayBackLinkProps) => {
  const palette = useResidentDialogPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label}`}
      hitSlop={8}
      style={{
        alignSelf: "flex-start",
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingRight: 8,
      }}
    >
      <Feather name="chevron-left" size={17} color={palette.accent} />
      <Text style={{ fontSize: 13.5, fontWeight: "600", color: palette.accent }}>{label}</Text>
    </Pressable>
  );
};

export default SupportOverlayBackLink;
