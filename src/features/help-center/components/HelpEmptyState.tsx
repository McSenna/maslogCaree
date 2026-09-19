import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type HelpEmptyStateProps = {
  onContactSupport: () => void;
};

const HelpEmptyState = ({ onContactSupport }: HelpEmptyStateProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        alignItems: "center",
        gap: 10,
        padding: 28,
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderWidth: 1,
        borderColor: palette.cardBorder,
      }}
    >
      <Feather name="search" size={26} color={palette.subtle} />
      <Text
        accessibilityRole="header"
        style={{ fontSize: 16, fontWeight: "700", color: palette.heading, textAlign: "center" }}
      >
        No help articles found
      </Text>
      <Text style={{ fontSize: 13, lineHeight: 19, color: palette.muted, textAlign: "center" }}>
        We couldn&apos;t find an article matching your search.
      </Text>

      <Pressable
        onPress={onContactSupport}
        accessibilityRole="button"
        style={{
          minHeight: 44,
          justifyContent: "center",
          marginTop: 4,
          paddingHorizontal: 20,
          borderRadius: RADIUS.control,
          backgroundColor: palette.primary,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>Contact Support</Text>
      </Pressable>
    </View>
  );
};

export default HelpEmptyState;
