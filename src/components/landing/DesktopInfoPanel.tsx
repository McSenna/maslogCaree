import { StyleSheet, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { LANDING_FEATURES } from "@/config/landingFeatures";
import type { DesktopLandingLayout } from "@/screens/landing/desktopLandingLayout";
import FeatureItem from "./FeatureItem";
import Reveal from "./motion/Reveal";
import { staggerDelay } from "./motion/landingMotion";

type DesktopInfoPanelProps = {
  metrics: DesktopLandingLayout["features"];
  revealDelay?: number;
};

const DesktopInfoPanel = ({ metrics, revealDelay = 0 }: DesktopInfoPanelProps) => {
  const itemMetrics = {
    iconBox: metrics.iconBox,
    titleSize: metrics.titleSize,
    descriptionSize: metrics.descriptionSize,
    rowPadding: metrics.rowPadding,
  };

  return (
    <View style={[styles.container, { gap: metrics.panelGap }]}>
      <Reveal delay={revealDelay}>
        <View
          style={[
            styles.accentLine,
            { width: metrics.accentWidth, height: metrics.accentHeight },
          ]}
        />
      </Reveal>

      <View style={{ gap: metrics.rowGap }}>
        {LANDING_FEATURES.map((feature, index) => (
          <Reveal key={feature.key} delay={staggerDelay(index + 1, revealDelay)}>
            <FeatureItem
              customIcon={feature.renderIcon(metrics.iconSize)}
              iconBgColor={feature.iconBgColor}
              title={feature.title}
              description={feature.description}
              metrics={itemMetrics}
            />
          </Reveal>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 620,
  },
  accentLine: {
    backgroundColor: LANDING_COLORS.primaryBlue,
    borderRadius: 3,
  },
});

export default DesktopInfoPanel;
