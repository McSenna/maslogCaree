import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type SupportCTAProps = {
  onContactSupport: () => void;
  onViewRequests: () => void;
};

const SupportCTA = ({ onContactSupport, onViewRequests }: SupportCTAProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        gap: 14,
        padding: 20,
        borderRadius: RADIUS.card,
        backgroundColor: palette.bannerBg,
        borderWidth: 1,
        borderColor: palette.bannerBorder,
      }}
    >
      <View style={{ gap: 5 }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 17, fontWeight: "700", color: palette.heading }}
        >
          Still need help?
        </Text>
        <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.muted }}>
          If you couldn&apos;t find the answer you&apos;re looking for, send us a support request and
          the MaslogCare support team will assist you.
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Pressable
          onPress={onContactSupport}
          accessibilityRole="button"
          style={{
            minHeight: 44,
            flexGrow: 1,
            flexBasis: 180,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingHorizontal: 18,
            borderRadius: RADIUS.control,
            backgroundColor: palette.primary,
          }}
        >
          <Feather name="life-buoy" size={16} color="#FFFFFF" />
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>Contact Support</Text>
        </Pressable>

        <Pressable
          onPress={onViewRequests}
          accessibilityRole="button"
          style={{
            minHeight: 44,
            flexGrow: 1,
            flexBasis: 180,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingHorizontal: 18,
            borderRadius: RADIUS.control,
            backgroundColor: palette.cardBg,
            borderWidth: 1,
            borderColor: palette.cardBorder,
          }}
        >
          <Feather name="inbox" size={16} color={palette.body} />
          <Text style={{ fontSize: 14, fontWeight: "700", color: palette.body }}>
            My Support Requests
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SupportCTA;
