import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface WaveDecorationProps {
  variant: "desktop" | "mobile";
}

/**
 * Decorative SVG wave system for MaslogCare.
 *
 * Desktop: Edge-to-edge organic multi-layered waves spanning the full 1920px
 * viewport width along the bottom edge, behind all foreground content.
 * Features prominent, graceful crests on the left and soft flowing curves
 * tapering towards the right behind the login card, perfectly positioned
 * below the feature list.
 *
 * Mobile: Soft wave transition bridging the hero photograph area and the
 * top edge of the white authentication card.
 */
export default function WaveDecoration({ variant }: WaveDecorationProps) {
  if (variant === "mobile") {
    return (
      <View style={styles.mobileWrapper} pointerEvents="none">
        <Svg
          width="100%"
          height={75}
          viewBox="0 0 400 75"
          preserveAspectRatio="none"
        >
          {/* Wave 3 — soft translucent sky blue */}
          <Path
            d="M0 32 C80 14, 170 48, 260 25 C320 10, 365 34, 400 22 L400 75 L0 75 Z"
            fill="rgba(191, 219, 254, 0.45)"
          />
          {/* Wave 2 — pale sky blue-tinted crest */}
          <Path
            d="M0 42 C95 22, 180 54, 275 32 C335 18, 375 40, 400 32 L400 75 L0 75 Z"
            fill="rgba(224, 238, 254, 0.75)"
          />
          {/* Wave 1 — solid #F2F7FD flowing seamlessly into the page background */}
          <Path
            d="M0 54 C105 34, 190 60, 290 44 C345 32, 380 48, 400 44 L400 75 L0 75 Z"
            fill="#F2F7FD"
          />
        </Svg>
      </View>
    );
  }

  // Desktop full-width wave system (1920px master viewBox, height 175)
  return (
    <View style={styles.desktopWrapper} pointerEvents="none">
      <Svg
        width="100%"
        height={175}
        viewBox="0 0 1920 175"
        preserveAspectRatio="none"
      >
        {/* Wave 3 (back layer) — soft light blue extending across */}
        <Path
          d="M0 68 C240 22, 460 105, 750 62 C1020 22, 1290 92, 1590 58 C1750 36, 1860 72, 1920 55 L1920 175 L0 175 Z"
          fill="rgba(147, 197, 253, 0.45)"
        />

        {/* Wave 2 (middle layer) — sky blue curve */}
        <Path
          d="M0 88 C210 38, 420 120, 670 74 C910 32, 1150 108, 1430 72 C1660 38, 1835 96, 1920 78 L1920 175 L0 175 Z"
          fill="rgba(96, 165, 250, 0.58)"
        />

        {/* Wave 1 (front layer) — vibrant royal blue with gentle crest */}
        <Path
          d="M0 108 C170 55, 340 130, 570 84 C790 42, 1030 115, 1290 84 C1520 48, 1760 105, 1920 92 L1920 175 L0 175 Z"
          fill="rgba(59, 130, 246, 0.82)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  desktopWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: "hidden",
  },
});
