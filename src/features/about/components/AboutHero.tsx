import { PALETTE } from "@/theme/palette";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const AboutHero = ({ isTablet }: { isTablet: boolean }) => {
  return (
    <View
      style={{
        borderRadius: 20,
        backgroundColor: PALETTE.blue[700],
        marginHorizontal: 4,
        padding: isTablet ? 32 : 24,
        gap: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.16)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="heart" size={22} color="#fff" />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: "rgba(255,255,255,0.8)",
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            About
          </Text>
          <Text
            accessibilityRole="header"
            style={{ fontSize: isTablet ? 28 : 24, fontWeight: "800", color: "#fff", letterSpacing: -0.4 }}
          >
            MaslogCare
          </Text>
        </View>
      </View>

      <Text
        style={{
          maxWidth: 640,
          fontSize: isTablet ? 16 : 15,
          lineHeight: isTablet ? 24 : 22,
          color: "rgba(255,255,255,0.92)",
        }}
      >
        The appointment app of the Barangay Maslog health office. Residents request health visits
        from their phone, and health staff schedule them, keep visit records, and post
        announcements.
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Feather name="map-pin" size={15} color="rgba(255,255,255,0.85)" />
        <Text style={{ flexShrink: 1, color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: "600" }}>
          Barangay 61 Maslog, Legazpi City
        </Text>
      </View>
    </View>
  );
};

export default AboutHero;
