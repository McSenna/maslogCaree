import { View } from "react-native";

import FeatureList from "./FeatureList";
import HowItWorks from "./HowItWorks";
import AboutHero from "./AboutHero";
import SectionLabel from "./SectionLabel";

type AboutMaslogCareContentProps = {
  wide: boolean;
};

const AboutMaslogCareContent = ({ wide }: AboutMaslogCareContentProps) => (
  <View style={{ gap: wide ? 24 : 20 }}>
    <AboutHero wide={wide} />

    <View style={{ gap: 12 }}>
      <SectionLabel>What you can do</SectionLabel>
      <FeatureList columns={wide} />
    </View>

    <View style={{ gap: 14 }}>
      <SectionLabel>How it works</SectionLabel>
      <HowItWorks horizontal={wide} />
    </View>
  </View>
);

export default AboutMaslogCareContent;
