import { View } from "react-native";

import DesktopInfoPanel from "@/components/landing/DesktopInfoPanel";
import MaslogCareBrand from "@/components/landing/MaslogCareBrand";
import HeroActions from "@/components/landing/hero/HeroActions";
import LandingHeadline from "@/components/landing/hero/LandingHeadline";
import Reveal from "@/components/landing/motion/Reveal";
import { staggerDelay } from "@/components/landing/motion/landingMotion";
import type { DesktopLandingLayout } from "./desktopLandingLayout";

import { styles } from "./landingStyles";

type DesktopHeroColumnProps = {
  layout: DesktopLandingLayout;
  onGetStarted: () => void;
  onLearnMore: () => void;
};

const DesktopHeroColumn = ({
  layout,
  onGetStarted,
  onLearnMore,
}: DesktopHeroColumnProps) => (
  <View style={[styles.desktopLeftColumn, { gap: layout.page.columnGap }]}>
    <Reveal delay={0}>
      <MaslogCareBrand
        variant="desktop"
        logoSize={layout.brand.logoSize}
        titleFontSize={layout.brand.titleFontSize}
      />
    </Reveal>

    <Reveal delay={staggerDelay(1)}>
      <LandingHeadline
        headlineSize={layout.headline.headlineSize}
        descriptionSize={layout.headline.descriptionSize}
        gap={layout.headline.gap}
      />
    </Reveal>

    <Reveal delay={staggerDelay(2)}>
      <HeroActions
        onGetStarted={onGetStarted}
        onLearnMore={onLearnMore}
        buttonHeight={layout.actions.buttonHeight}
        gap={layout.actions.gap}
      />
    </Reveal>

    <DesktopInfoPanel metrics={layout.features} revealDelay={staggerDelay(3)} />
  </View>
);

export default DesktopHeroColumn;
