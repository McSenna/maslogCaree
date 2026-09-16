import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
};

const styles = StyleSheet.create({
  fillImage: {
    width: "100%",
    height: "100%",
  },
});

export default LandingBackground;
