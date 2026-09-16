import { View } from "react-native";

import FeatureList from "./FeatureList";
import HowItWorks from "./HowItWorks";
import LearnMoreHero from "./LearnMoreHero";
import SectionLabel from "./SectionLabel";

type LearnMoreContentProps = {
  wide: boolean;
};

const LearnMoreContent = ({ wide }: LearnMoreContentProps) => (
  <View style={{ gap: wide ? 24 : 20 }}>
    <LearnMoreHero wide={wide} />

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

export default LearnMoreContent;
