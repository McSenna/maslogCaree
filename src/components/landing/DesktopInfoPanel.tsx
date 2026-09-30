import { StyleSheet, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { LANDING_FEATURES } from "@/config/landingFeatures";
import type { DesktopLandingLayout } from "@/screens/landing/desktopLandingLayout";
import FeatureItem from "./FeatureItem";

type DesktopInfoPanelProps = {
  metrics: DesktopLandingLayout["features"];
};

const DesktopInfoPanel = ({ metrics }: DesktopInfoPanelProps) => {
  const itemMetrics = {
    iconBox: metrics.iconBox,
    titleSize: metrics.titleSize,
    descriptionSize: metrics.descriptionSize,
    rowPadding: metrics.rowPadding,
  };

  return (
    <View style={[styles.container, { gap: metrics.panelGap }]}>
      <View
        style={[
          styles.accentLine,
          { width: metrics.accentWidth, height: metrics.accentHeight },
        ]}
      />

      <View style={{ gap: metrics.rowGap }}>
        {LANDING_FEATURES.map((feature) => (
          <FeatureItem
            key={feature.key}
            customIcon={feature.renderIcon(metrics.iconSize)}
            iconBgColor={feature.iconBgColor}
            title={feature.title}
            description={feature.description}
            metrics={itemMetrics}
          />
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
