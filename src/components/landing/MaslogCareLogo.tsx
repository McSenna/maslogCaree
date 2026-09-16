import { Image } from "react-native";
import { landingAssets } from "@/config/landingAssets";

interface MaslogCareLogoProps {
  size?: number;
}

const MaslogCareLogo = ({ size = 72 }: MaslogCareLogoProps) => (
  <Image
    source={landingAssets.brandMark}
    resizeMode="contain"
    style={{ width: size, height: size }}
    accessibilityLabel="Barangay 61 Maslog, Legazpi City seal"
    accessibilityIgnoresInvertColors
  />
);

export default MaslogCareLogo;
