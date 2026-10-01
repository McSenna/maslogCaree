import { Text, View } from "react-native";

import MaslogCareLogo from "@/components/landing/MaslogCareLogo";
import { LANDING_COLORS } from "@/config/landingAssets";

import { PROFILE_COLORS } from "../../config/profileTheme";

const FooterBrand = () => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
    <MaslogCareLogo size={32} />
    <View>
      <Text style={{ fontSize: 16.5, fontWeight: "800", letterSpacing: -0.3 }}>
        <Text style={{ color: LANDING_COLORS.navy }}>Maslog</Text>
        <Text style={{ color: LANDING_COLORS.primaryBlue }}>Care</Text>
      </Text>
      <Text
        style={{
          fontSize: 9.5,
          lineHeight: 12,
          fontWeight: "600",
          color: PROFILE_COLORS.subtle,
        }}
      >
        Healthy Residents, Stronger Community
      </Text>
    </View>
  </View>
);

const ProfileModalFooter = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: PROFILE_COLORS.border,
        backgroundColor: PROFILE_COLORS.surface,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <FooterBrand />
      </View>
    </View>
  );
};

export default ProfileModalFooter;
