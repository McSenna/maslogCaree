import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type SupportRequestsHeaderProps = {
  onContactSupport: () => void;
};

const SupportRequestsHeader = ({ onContactSupport }: SupportRequestsHeaderProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.muted }}>
        Track the status of concerns you sent to the MaslogCare support team.
      </Text>

      <Pressable
        onPress={onContactSupport}
        accessibilityRole="button"
        style={{
          alignSelf: "flex-start",
          minHeight: 44,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 18,
          borderRadius: RADIUS.control,
          backgroundColor: palette.primary,
        }}
      >
        <Feather name="plus" size={16} color="#FFFFFF" />
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
          New Support Request
        </Text>
      </Pressable>
    </View>
  );
};

export default SupportRequestsHeader;
