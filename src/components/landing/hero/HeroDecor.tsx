import { StyleSheet, View } from "react-native";
import HeroOrb from "./HeroOrb";

const ORB_BLUE = ["rgba(8, 102, 245, 0.10)", "rgba(8, 102, 245, 0.00)"] as const;
const ORB_GREEN = ["rgba(22, 163, 74, 0.10)", "rgba(22, 163, 74, 0.00)"] as const;
const ORB_SKY = ["rgba(56, 189, 248, 0.12)", "rgba(56, 189, 248, 0.00)"] as const;

type HeroDecorProps = {
  compact?: boolean;
};

const HeroDecor = ({ compact = false }: HeroDecorProps) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
  >
    <HeroOrb
      size={compact ? 300 : 420}
      colors={ORB_BLUE}
      top={compact ? -90 : -120}
      left={compact ? -110 : -140}
      distance={14}
      duration={7000}
    />

    <HeroOrb
      size={compact ? 240 : 330}
      colors={ORB_SKY}
      top={compact ? "12%" : "8%"}
      right={compact ? -100 : -80}
      distance={11}
      duration={6200}
      delay={700}
    />

    <HeroOrb
      size={compact ? 220 : 300}
      colors={ORB_GREEN}
      bottom={compact ? "6%" : "10%"}
      left={compact ? "26%" : "34%"}
      distance={9}
      duration={7800}
      delay={1400}
    />
  </View>
);

export default HeroDecor;
