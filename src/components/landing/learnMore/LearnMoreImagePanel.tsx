import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { LANDING_COLORS, landingAssets } from "@/config/landingAssets";
import { LEARN_MORE_INTRO } from "@/config/learnMoreContent";

import { LEARN_MORE_RADIUS } from "./learnMoreTheme";

type LearnMoreImagePanelProps = {
  height: number;
};

const LearnMoreImagePanel = ({ height }: LearnMoreImagePanelProps) => {
  const source = landingAssets.barangayBackground;

  if (!source) return null;

  return (
    <View
      style={{
        height,
        borderRadius: LEARN_MORE_RADIUS.image,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: LANDING_COLORS.border,
        backgroundColor: LANDING_COLORS.softBlue,
      }}
    >
      <Image
        source={source}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
        accessibilityLabel="Barangay Maslog health facility"
        accessibilityIgnoresInvertColors
      />

      <LinearGradient
        colors={["rgba(8, 21, 47, 0)", "rgba(8, 21, 47, 0.12)", "rgba(8, 21, 47, 0.72)"]}
        locations={[0, 0.45, 1]}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }}
        pointerEvents="none"
      />

      <Text
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 12,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "700",
          color: LANDING_COLORS.white,
        }}
      >
        {LEARN_MORE_INTRO.imageCaption}
      </Text>
    </View>
  );
};

export default LearnMoreImagePanel;
