import { Text, View } from "react-native";
import { HC } from "../constants/aboutTheme";
import AboutSectionHeader from "./AboutSectionHeader";

/** Who the barangay is, behind a teal rule. */
export default function CommunitySection({ isTablet }: { isTablet: boolean }) {
  return (
    <View>
      <AboutSectionHeader
        eyebrow="Our Community"
        title="About Barangay Maslog"
        isTablet={isTablet}
      />
      <View
        style={{
          backgroundColor: HC.white,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: HC.border,
        }}
      >
        <View style={{ flexDirection: "row", gap: 14 }}>
          <View style={{ width: 4, borderRadius: 2, backgroundColor: HC.teal }} />
          <Text
            style={{
              flex: 1,
              color: HC.slate,
              lineHeight: isTablet ? 22 : 20,
              fontSize: isTablet ? 14 : 12.5,
            }}
          >
            Barangay Maslog is a vibrant community dedicated to the health and well-being of its
            residents. Our healthcare workers and medical professionals are committed to providing
            comprehensive healthcare services to ensure a healthier community for all.
          </Text>
        </View>
      </View>
    </View>
  );
}
