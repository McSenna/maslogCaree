import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const AboutHero = ({ isTablet }: { isTablet: boolean }) => {
  return (
    <View
      style={{
        borderRadius: 24,
        backgroundColor: "#7988d2",
        marginHorizontal: 4,
        padding: 24,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: "rgba(255,255,255,0.09)",
          top: -30,
          right: -30,
          pointerEvents: "none",
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: "rgba(255,255,255,0.07)",
          bottom: 10,
          left: -10,
          pointerEvents: "none",
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="heart" size={22} color="#fff" />
        </View>
        <View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: "rgba(255,255,255,0.65)",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Barangay Maslog
          </Text>
          <Text style={{ fontSize: isTablet ? 22 : 20, fontWeight: "800", color: "#fff" }}>
            Maslog Care
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: isTablet ? 14 : 13,
          color: "rgba(255,255,255,0.78)",
          lineHeight: 21,
          marginBottom: 20,
        }}
      >
        Stay updated with the latest health services, programs, and care reminders from your
        community.
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          alignSelf: "flex-start",
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 50,
          paddingHorizontal: 16,
          paddingVertical: 9,
        }}
      >
        <Feather name="users" size={14} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
          Free Community Health Services
        </Text>
      </View>
    </View>
  );
};

export default AboutHero;
