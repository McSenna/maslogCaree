import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { landingAssets } from "@/config/landingAssets";

interface LandingBackgroundProps {
  /** "desktop" for full-viewport background; "mobile" for hero region */
  variant: "desktop" | "mobile";
}

/**
 * Absolute-positioned edge-to-edge background layer for MaslogCare.
 *
 * Designed according to the layered specification:
 * LAYER 1: Barangay Background Image (when non-null)
 * LAYER 2: Soft blue atmospheric overlay
 * LAYER 3: White transparency gradient (stronger on the left for text legibility)
 *
 * When `landingAssets.barangayBackground` is null, renders the complete
 * atmospheric soft blue/white environment without any broken image or placeholder.
 *
 * Stays strictly behind all foreground content and never intercepts touches.
 */
export default function LandingBackground({ variant }: LandingBackgroundProps) {
  const backgroundSource = landingAssets.barangayBackground;

  if (variant === "mobile") {
    return (
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        {/* Layer 1: Background photo (when provided) */}
        {backgroundSource && (
          <Image
            source={backgroundSource}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
            accessibilityIgnoresInvertColors
          />
        )}

        {/* Layer 2: Mobile atmospheric sky gradient */}
        <LinearGradient
          colors={[
            "rgba(240, 247, 255, 0.98)",
            "rgba(230, 242, 255, 0.90)",
            "rgba(215, 235, 255, 0.75)",
            "rgba(235, 245, 255, 0.95)",
          ]}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  // Desktop edge-to-edge background
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      {/* Base soft blue background tint */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "#F2F7FD" },
        ]}
      />

      {/* Layer 1: Background photo (anchored towards center-right/bottom) */}
      {backgroundSource && (
        <Image
          source={backgroundSource}
          resizeMode="cover"
          style={[
            StyleSheet.absoluteFill,
            { opacity: 0.85 },
          ]}
          accessibilityIgnoresInvertColors
        />
      )}

      {/* Layer 2: Left-to-right fade (heavier on the left to ensure info readability) */}
      <LinearGradient
        colors={[
          "rgba(242, 247, 253, 0.98)",
          "rgba(240, 246, 253, 0.92)",
          "rgba(236, 244, 253, 0.75)",
          "rgba(230, 240, 253, 0.45)",
          "rgba(225, 238, 252, 0.30)",
        ]}
        locations={[0, 0.35, 0.55, 0.75, 1]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 1, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Layer 3: Top-to-bottom soft atmospheric gradient */}
      <LinearGradient
        colors={[
          "rgba(245, 249, 255, 0.90)",
          "rgba(238, 245, 254, 0.50)",
          "transparent",
          "rgba(235, 244, 255, 0.60)",
        ]}
        locations={[0, 0.25, 0.6, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
