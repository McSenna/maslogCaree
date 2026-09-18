import { StyleSheet, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";

import FloatingGlyph from "./FloatingGlyph";

const FloatingGlyphs = () => (
  <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
    <FloatingGlyph
      icon="calendar-outline"
      color={LANDING_COLORS.primaryBlue}
      background="rgba(231, 241, 255, 0.92)"
      size={58}
      top={-28}
      left={-34}
      duration={5000}
    />

    <FloatingGlyph
      icon="heart-outline"
      color={LANDING_COLORS.green}
      background="rgba(221, 244, 229, 0.92)"
      size={50}
      bottom={-26}
      right={-28}
      distance={6}
      duration={5800}
      delay={900}
    />
  </View>
);

export default FloatingGlyphs;
