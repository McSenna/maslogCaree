import { View } from "react-native";
import { SPLASH_COLORS } from "../splashTheme";
import { Palm, Peak } from "./SplashDecorations";

const MountainBand = ({ width, bandHeight }: { width: number; bandHeight: number }) => {
  const peak = bandHeight * 0.92;

  return (
    <View className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: bandHeight }}>
      <Peak size={peak} left={width * 0.52} bottom={-peak * 0.42} opacity={0.55} />
      <Peak size={peak * 0.7} left={width * 0.3} bottom={-peak * 0.32} opacity={0.38} />

      <Palm left={width * 0.06} bottom={bandHeight * 0.3} scale={1} />
      <Palm left={width * 0.17} bottom={bandHeight * 0.24} scale={0.82} />

      <View
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          bottom: -bandHeight * 0.5,
          height: bandHeight,
          borderTopLeftRadius: width,
          borderTopRightRadius: width * 0.7,
          backgroundColor: SPLASH_COLORS.mountain,
          opacity: 0.5,
        }}
      />
      <View
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          bottom: -bandHeight * 0.62,
          height: bandHeight * 0.9,
          borderTopLeftRadius: width * 0.8,
          borderTopRightRadius: width,
          backgroundColor: SPLASH_COLORS.foliage,
          opacity: 0.55,
        }}
      />
    </View>
  );
};

export default MountainBand;
