import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { RESIDENT_COLORS, TONES } from "./residentTheme";

type BannerArtworkProps = {
  /** Overall height; the shapes scale from it so the art keeps its proportions. */
  size?: number;
};

/**
 * The community/health motif that sits at the right of the welcome banner.
 *
 * Composed from primitives rather than shipped as a bitmap: it has to tint with
 * the MaslogCare palette, stay crisp at every density, and survive being
 * cropped as the banner narrows — none of which a fixed PNG does well. Purely
 * decorative, so it is hidden from screen readers.
 */
const BannerArtwork = ({ size = 96 }: BannerArtworkProps) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    pointerEvents="none"
    className="flex-row items-end justify-end"
    // Wide enough for the three circles (1.96x) plus their gaps and a right
    // inset, so nothing is clipped by the banner's overflow-hidden.
    style={{ height: size, width: size * 2.4, paddingRight: size * 0.18 }}
  >
    {/* Soft blue wash behind the figures */}
    <View
      className="absolute rounded-full"
      style={{
        width: size * 1.5,
        height: size * 1.5,
        right: size * 0.15,
        bottom: -size * 0.55,
        backgroundColor: "#DBE9FD",
        opacity: 0.75,
      }}
    />

    {/* Care heart */}
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size * 0.52,
        height: size * 0.52,
        marginBottom: size * 0.12,
        marginRight: size * 0.08,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Ionicons name="heart" size={size * 0.26} color={TONES.pink.fg} />
    </View>

    {/* Family / community */}
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size * 0.66,
        height: size * 0.66,
        marginBottom: size * 0.06,
        marginRight: size * 0.08,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Ionicons name="people" size={size * 0.34} color={RESIDENT_COLORS.primary} />
    </View>

    {/* Health worker */}
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size * 0.78,
        height: size * 0.78,
        backgroundColor: RESIDENT_COLORS.primary,
      }}
    >
      <Ionicons name="medkit" size={size * 0.38} color="#FFFFFF" />
    </View>

    {/* Foliage accent, echoing the design's plant motif */}
    <View
      className="absolute rounded-full"
      style={{
        width: size * 0.26,
        height: size * 0.48,
        right: size * 0.02,
        bottom: size * 0.12,
        backgroundColor: TONES.green.bg,
        transform: [{ rotate: "18deg" }],
      }}
    />
  </View>
);

export default BannerArtwork;
