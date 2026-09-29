import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { landingAssets } from "@/config/landingAssets";

interface LandingBackgroundProps {
  variant: "desktop" | "mobile";
}

const LandingBackground = ({ variant }: LandingBackgroundProps) => {
  const backgroundSource = landingAssets.barangayBackground;

  if (variant === "mobile") {
    return (
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#E8F1FD" }]} />

        {backgroundSource && (
          <Image
            source={backgroundSource}
            resizeMode="cover"
            resizeMethod="resize"
            style={[StyleSheet.absoluteFill, styles.fillImage]}
            accessibilityIgnoresInvertColors
          />
        )}

        {/* One solid wash keeps text readable over the photo. */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(230, 242, 255, 0.72)" }]} />
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#EFF6FD" }]} />

      {backgroundSource && (
        <Image
          source={backgroundSource}
          resizeMode="cover"
          resizeMethod="resize"
          style={[StyleSheet.absoluteFill, styles.fillImage, { opacity: 0.40 }]}
          accessibilityIgnoresInvertColors
        />
      )}

      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(241, 247, 255, 0.82)" }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  fillImage: {
    width: "100%",
    height: "100%",
  },
});

export default LandingBackground;
