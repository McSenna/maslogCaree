import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { landingAssets } from "@/config/landingAssets";

interface LandingBackgroundProps {
  variant: "desktop" | "mobile";
}

export default function LandingBackground({ variant }: LandingBackgroundProps) {
  const backgroundSource = landingAssets.barangayBackground;

  if (variant === "mobile") {
    return (
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        {/* Base tint sits under the photo so a null asset still reads correctly */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#E8F1FD" }]} />

        {/* Layer 1: Barangay hall photograph */}
        {backgroundSource && (
          <Image
            source={backgroundSource}
            resizeMode="cover"
            style={[StyleSheet.absoluteFill, styles.fillImage]}
            accessibilityIgnoresInvertColors
          />
        )}

        {/* Layer 2: Blue atmospheric veil — light enough that the hall, flag and
            trees stay clearly recognizable, per the approved mobile design. */}
        <LinearGradient
          colors={[
            "rgba(232, 243, 255, 0.86)",
            "rgba(226, 240, 255, 0.60)",
            "rgba(222, 238, 255, 0.42)",
            "rgba(228, 241, 255, 0.58)",
            "rgba(238, 246, 254, 0.86)",
          ]}
          locations={[0, 0.22, 0.5, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 3: Gentle lift behind the wordmark and the status-bar icons.
            Kept subtle on purpose — a stronger wash reads as a separate pale
            strip above the hero instead of one continuous image. */}
        <LinearGradient
          colors={[
            "rgba(248, 252, 255, 0.42)",
            "rgba(248, 252, 255, 0.14)",
            "transparent",
          ]}
          locations={[0, 0.14, 0.3]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  // Desktop edge-to-edge background
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      {/* Base soft blue background tint */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#EFF6FD" }]} />

      {/* Layer 1: Barangay photograph, softened so it reads as atmosphere
          rather than as a competing hero image. */}
      {backgroundSource && (
        <Image
          source={backgroundSource}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, styles.fillImage, { opacity: 0.42 }]}
          accessibilityIgnoresInvertColors
        />
      )}

      {/* Layer 2: Left-to-right white fade — heaviest behind the information
          column, easing off toward the centre-right of the frame. */}
      <LinearGradient
        colors={[
          "rgba(244, 249, 255, 0.97)",
          "rgba(242, 248, 255, 0.88)",
          "rgba(238, 246, 255, 0.68)",
          "rgba(234, 244, 255, 0.52)",
          "rgba(236, 245, 255, 0.62)",
        ]}
        locations={[0, 0.3, 0.5, 0.74, 1]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 1, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Layer 3: Top-to-bottom atmospheric gradient — near-white at the top
          edge, easing into the wave system at the bottom. */}
      <LinearGradient
        colors={[
          "rgba(247, 251, 255, 0.96)",
          "rgba(242, 248, 255, 0.62)",
          "rgba(238, 246, 255, 0.28)",
          "rgba(232, 242, 255, 0.55)",
        ]}
        locations={[0, 0.22, 0.58, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

/**
 * React Native Web renders <Image> at the source's intrinsic size unless the
 * box is pinned explicitly, so absoluteFill alone lets a large photo overflow
 * its container and get clipped by `overflow: hidden`. Pinning width/height to
 * 100% keeps `resizeMode="cover"` cropping against the hero box as intended.
 */
const styles = StyleSheet.create({
  fillImage: {
    width: "100%",
    height: "100%",
  },
});
