import { Text, View } from "react-native";
import { HC } from "../constants/aboutTheme";
import AboutSectionHeader from "./AboutSectionHeader";

const CommunitySection = ({ isTablet }: { isTablet: boolean }) => {
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
              lineHeight: isTablet ? 23 : 21,
              fontSize: isTablet ? 15 : 14,
            }}
          >
            Barangay 61 Maslog is in Legazpi City, Albay. Its health office offers general
            checkups, consultations, prenatal care, immunization, and blood pressure checks, run by
            doctors, midwives, and barangay health workers.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CommunitySection;
