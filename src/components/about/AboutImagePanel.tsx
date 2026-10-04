import { Image, Text, View } from "react-native";

import { LANDING_COLORS, landingAssets } from "@/config/landingAssets";
import { LEARN_MORE_INTRO } from "@/config/learnMoreContent";

import { ABOUT_RADIUS } from "./aboutTheme";
import { PALETTE, withAlpha } from "@/theme/palette";

type AboutImagePanelProps = {
  height: number;
};

const AboutImagePanel = ({ height }: AboutImagePanelProps) => {
  const source = landingAssets.barangayBackground;

  if (!source) return null;

  return (
    <View
      style={{
        height,
        borderRadius: ABOUT_RADIUS.image,
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

      {/* A solid caption band instead of a dark fade over the photo. */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: withAlpha(PALETTE.ink, 0.68),
          pointerEvents: "none",
        }}
      >
      <Text
        style={{
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "700",
          color: LANDING_COLORS.white,
        }}
      >
        {LEARN_MORE_INTRO.imageCaption}
      </Text>
      </View>
    </View>
  );
};

export default AboutImagePanel;
