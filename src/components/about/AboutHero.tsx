import { Text, View } from "react-native";

import { LANDING_COLORS } from "@/config/landingAssets";
import { LEARN_MORE_INTRO } from "@/config/learnMoreContent";

import AboutImagePanel from "./AboutImagePanel";
import SectionLabel from "./SectionLabel";

type AboutHeroProps = {
  wide: boolean;
};

const AboutHero = ({ wide }: AboutHeroProps) => (
  <View
    style={{
      flexDirection: wide ? "row" : "column",
      alignItems: wide ? "center" : "stretch",
      gap: wide ? 22 : 16,
    }}
  >
    <View style={{ flex: wide ? 1 : undefined, minWidth: 0, gap: 10 }}>
      <SectionLabel>{LEARN_MORE_INTRO.eyebrow}</SectionLabel>

      <Text
        style={{
          fontSize: wide ? 25 : 21,
          lineHeight: wide ? 32 : 28,
          fontWeight: "800",
          letterSpacing: -0.6,
          color: LANDING_COLORS.navy,
        }}
      >
        {`${LEARN_MORE_INTRO.titleLead} `}
        <Text style={{ color: LANDING_COLORS.primaryBlue }}>
          {LEARN_MORE_INTRO.titleAccent}
        </Text>
      </Text>

      <Text
        style={{
          fontSize: wide ? 14 : 13.5,
          lineHeight: wide ? 21 : 20,
          color: LANDING_COLORS.mutedText,
        }}
      >
        {LEARN_MORE_INTRO.description}
      </Text>
    </View>

    <View style={{ width: wide ? 268 : "100%", flexShrink: 0 }}>
      <AboutImagePanel height={wide ? 178 : 132} />
    </View>
  </View>
);

export default AboutHero;
