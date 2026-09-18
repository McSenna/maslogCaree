import { Text, View } from "react-native";

import { LANDING_COLORS } from "@/config/landingAssets";

const SectionLabel = ({ children }: { children: string }) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
    <View
      style={{
        width: 18,
        height: 2,
        borderRadius: 2,
        backgroundColor: LANDING_COLORS.primaryBlue,
      }}
    />
    <Text
      accessibilityRole="header"
      style={{
        fontSize: 11.5,
        fontWeight: "800",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: LANDING_COLORS.primaryBlue,
      }}
    >
      {children}
    </Text>
  </View>
);

export default SectionLabel;
