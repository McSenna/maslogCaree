import { Image, Text, View } from "react-native";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

/**
 * The official Barangay 61 Maslog seal.
 *
 * The real artwork from the app's own assets, never redrawn — a government
 * seal is a mark of authority, and an approximation of one is worse than none.
 * `contain` on a square box so it cannot be stretched out of round.
 */
const BARANGAY_SEAL = require("../../../../assets/images/maslogicon.png");

/**
 * Whose system this is, at the head of the sidebar.
 *
 * The seal, the product name and the barangay's motto — the identity block the
 * header used to carry. Moving it here is what lets the header become a thin
 * bar of controls: the branding is stated once, at the top of the rail, rather
 * than repeated across the top of every page.
 */
export default function SidebarBrand({ palette }: { palette: SidebarPalette }) {
  return (
    <View className="w-full items-center">
      <Image
        source={BARANGAY_SEAL}
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
}
