import { LinearGradient } from "expo-linear-gradient";
import { View, useWindowDimensions } from "react-native";
import MountainBand from "./backdrop/MountainBand";
import { Cloud } from "./backdrop/SplashDecorations";
import { SPLASH_COLORS } from "./splashTheme";

const SplashBackdrop = () => {
  const { width, height } = useWindowDimensions();

  const bandHeight = Math.max(150, height * 0.22);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      className="absolute inset-0"
    >
      <LinearGradient
        colors={[SPLASH_COLORS.skyTop, SPLASH_COLORS.skyMid, SPLASH_COLORS.base]}
        locations={[0, 0.45, 1]}
        className="absolute left-0 right-0 top-0"
        style={{ height: height * 0.62 }}
      />

      <Cloud top={height * 0.07} left={-24} scale={1.1} />
      <Cloud top={height * 0.13} left={width - 96} scale={0.9} />

      <MountainBand width={width} bandHeight={bandHeight} />
    </View>
  );
};

export default SplashBackdrop;
