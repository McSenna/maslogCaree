import { Ionicons } from "@expo/vector-icons";
import { Platform, Text, View } from "react-native";

import { LANDING_COLORS } from "@/config/landingAssets";
import type { LearnMoreFeature as FeatureData } from "@/config/learnMoreContent";

import ServiceChip from "./ServiceChip";
import { ABOUT_RADIUS, TONE_PALETTE } from "./aboutTheme";

type AboutFeatureProps = {
  feature: FeatureData;
  stacked: boolean;
};

// Static information: no hover lift, since that would suggest the card can be clicked.
const AboutFeature = ({ feature, stacked }: AboutFeatureProps) => {
  const palette = TONE_PALETTE[feature.tone];
  const services = feature.services ?? [];
  const serviceList = services.length > 0 ? ` ${services.join(", ")}.` : "";

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${feature.title}. ${feature.description}${serviceList}`}
      style={{
        flex: stacked ? undefined : 1,
        minWidth: 0,
        gap: 10,
        padding: 14,
        borderRadius: ABOUT_RADIUS.card,
        borderWidth: 1,
        borderColor: LANDING_COLORS.border,
        backgroundColor: LANDING_COLORS.white,
        ...Platform.select({
          web: { boxShadow: "0px 1px 2px rgba(8, 21, 47, 0.04)" } as object,
        }),
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.bg,
        }}
      >
        <Ionicons name={feature.icon} size={20} color={palette.fg} />
      </View>

      <Text style={{ fontSize: 14.5, fontWeight: "700", color: LANDING_COLORS.navy }}>
        {feature.title}
      </Text>

      <Text style={{ fontSize: 13, lineHeight: 19, color: LANDING_COLORS.mutedText }}>
        {feature.description}
      </Text>

      {services.length > 0 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {services.map((service) => (
            <ServiceChip key={service} label={service} tone={feature.tone} />
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default AboutFeature;
