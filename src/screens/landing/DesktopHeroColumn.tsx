import { View } from "react-native";

import DesktopInfoPanel from "@/components/landing/DesktopInfoPanel";
import MaslogCareBrand from "@/components/landing/MaslogCareBrand";
import HeroActions from "@/components/landing/hero/HeroActions";
import LandingHeadline from "@/components/landing/hero/LandingHeadline";
import type { DesktopLandingLayout } from "./desktopLandingLayout";

import { styles } from "./landingStyles";

type DesktopHeroColumnProps = {
  layout: DesktopLandingLayout;
  onGetStarted: () => void;
  onLearnMore: () => void;
};

// Painted at once: only the sign-in card has an entrance, so the page does not stagger in piece by piece.
const DesktopHeroColumn = ({
  layout,
  onGetStarted,
  onLearnMore,
}: DesktopHeroColumnProps) => (
  <View style={[styles.desktopLeftColumn, { gap: layout.page.columnGap }]}>
    <MaslogCareBrand
      variant="desktop"
      logoSize={layout.brand.logoSize}
      titleFontSize={layout.brand.titleFontSize}
    />

    <LandingHeadline
      headlineSize={layout.headline.headlineSize}
      descriptionSize={layout.headline.descriptionSize}
      gap={layout.headline.gap}
    />

    <HeroActions
      onGetStarted={onGetStarted}
      onLearnMore={onLearnMore}
      buttonHeight={layout.actions.buttonHeight}
      gap={layout.actions.gap}
    />

    <DesktopInfoPanel metrics={layout.features} />
  </View>
);

export default DesktopHeroColumn;
