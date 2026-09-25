import { Image, Text, View } from "react-native";
import { landingAssets } from "@/config/landingAssets";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

const SidebarBrand = ({ palette }: { palette: SidebarPalette }) => {
  return (
    <View className="w-full items-center">
      <Image
        source={landingAssets.brandMark}
        accessibilityLabel="Barangay 61 Maslog, Legazpi City seal"
        resizeMode="contain"
        style={{
          width: SIDEBAR_METRICS.sealSize,
          height: SIDEBAR_METRICS.sealSize,
          flexShrink: 0,
        }}
      />

      <Text
        numberOfLines={1}
        className="mt-2.5 text-[26px] font-extrabold"
        style={{ letterSpacing: -0.6 }}
      >
        <Text style={{ color: palette.brandNavy }}>Maslog</Text>
        <Text style={{ color: palette.brandBlue }}>Care</Text>
      </Text>

      <Text
        className="mt-1 text-center text-[8.5px] font-semibold uppercase"
        style={{ color: palette.tagline, letterSpacing: 1.9, lineHeight: 13 }}
      >
        Healthier Maslog{"\n"}Brighter Tomorrow
      </Text>
    </View>
  );
};

export default SidebarBrand;
