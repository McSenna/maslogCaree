import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

interface WaveDecorationProps {
  variant: "desktop" | "mobile";
  /** Shorter band for compact desktops (e.g. 1366×768). */
  compact?: boolean;
}

export const WAVE_HEIGHT_MOBILE = 92;

export const WAVE_HEIGHT_DESKTOP = 210;

export const WAVE_HEIGHT_DESKTOP_COMPACT = 150;

export const desktopWaveHeight = (compact: boolean) =>
  compact ? WAVE_HEIGHT_DESKTOP_COMPACT : WAVE_HEIGHT_DESKTOP;


const WaveDecoration = ({
  variant,
  compact = false,
}: WaveDecorationProps) => {
  if (variant === "mobile") {
    return (
      <View style={styles.mobileWrapper} pointerEvents="none">
        <Svg
          width="100%"
          height={WAVE_HEIGHT_MOBILE}
          viewBox="0 0 400 92"
          preserveAspectRatio="none"
        >
          {/* Back layer — soft sky blue */}
          <Path
            d="M0 26 C70 6, 150 40, 232 24 C300 11, 356 32, 400 20 L400 92 L0 92 Z"
            fill="rgba(173, 209, 255, 0.55)"
          />
          {/* Middle layer — pale blue-white */}
          <Path
            d="M0 44 C86 20, 172 54, 258 36 C322 22, 366 42, 400 34 L400 92 L0 92 Z"
            fill="rgba(224, 238, 255, 0.9)"
          />
          {/* Front layer — page background, flows seamlessly into the card area */}
          <Path
            d="M0 62 C100 40, 190 68, 288 52 C344 42, 378 56, 400 50 L400 92 L0 92 Z"
            fill="#F2F7FD"
          />
        </Svg>
      </View>
    );
  }

  // Desktop full-width wave system (1920px master viewBox)
  return (
    <View style={styles.desktopWrapper} pointerEvents="none">
      <Svg
        width="100%"
        height={desktopWaveHeight(compact)}
        viewBox="0 0 1920 210"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="maslogWaveFront" x1="0" y1="0" x2="1" y2="0.6">
            <Stop offset="0" stopColor="#8CB9FF" stopOpacity="0.95" />
            <Stop offset="0.55" stopColor="#5E9BF5" stopOpacity="0.95" />
            <Stop offset="1" stopColor="#4A90F7" stopOpacity="0.92" />
          </LinearGradient>
        </Defs>

        {/* Back layer — near-white crest, highest on the left */}
        <Path
          d="M0 58 C200 20, 420 46, 640 70 C900 98, 1180 124, 1450 142 C1640 154, 1810 160, 1920 162 L1920 210 L0 210 Z"
          fill="#FFFFFF"
          opacity={0.72}
        />

        {/* Middle layer — pale blue */}
        <Path
          d="M0 96 C190 58, 400 86, 620 110 C880 138, 1170 160, 1440 174 C1630 183, 1800 187, 1920 189 L1920 210 L0 210 Z"
          fill="#DCEBFF"
          opacity={0.92}
        />

        {/* Front layer — brand blue, tapering to a slim band on the right */}
        <Path
          d="M0 136 C180 100, 390 126, 610 150 C870 178, 1170 192, 1450 199 C1640 203, 1810 205, 1920 206 L1920 210 L0 210 Z"
          fill="url(#maslogWaveFront)"
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

export default WaveDecoration