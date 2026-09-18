import { Text, View } from "react-native";

import { LANDING_COLORS } from "@/config/landingAssets";
import { LEARN_MORE_FOOTER } from "@/config/learnMoreContent";

type AboutFooterProps = {
  paddingHorizontal: number;
  bottomInset?: number;
};

const AboutFooter = ({ paddingHorizontal, bottomInset = 0 }: AboutFooterProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 6,
      paddingHorizontal,
      paddingTop: 13,
      paddingBottom: 13 + bottomInset,
      borderTopWidth: 1,
      borderTopColor: LANDING_COLORS.border,
      backgroundColor: LANDING_COLORS.pageBg,
    }}
  >
    <Text style={{ fontSize: 12.5, fontWeight: "800", color: LANDING_COLORS.navy }}>
      {LEARN_MORE_FOOTER.brand}
    </Text>
    <Text style={{ fontSize: 12.5, color: LANDING_COLORS.mutedText }}>
      {LEARN_MORE_FOOTER.tagline}
    </Text>
    <View style={{ flex: 1, minWidth: 0 }} />
    <Text style={{ fontSize: 11.5, color: LANDING_COLORS.mutedText }}>
      {LEARN_MORE_FOOTER.location}
    </Text>
  </View>
);

export default AboutFooter;
