import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BREAKPOINTS } from "@/constants/breakpoints";
import {
  desktopWaveHeight,
  WAVE_HEIGHT_MOBILE,
} from "@/components/landing/WaveDecoration";
import { LANDING_COLORS } from "@/config/landingAssets";

import LandingBackground from "@/components/landing/LandingBackground";
import WaveDecoration from "@/components/landing/WaveDecoration";
import MaslogCareBrand from "@/components/landing/MaslogCareBrand";
import DesktopInfoPanel from "@/components/landing/DesktopInfoPanel";
import AuthCard from "@/components/landing/AuthCard";
import RegistrationModal from "@/components/ui/RegistrationModal";

/**
 * Full-screen landing & login page for MaslogCare.
 *
 * DESKTOP (≥1024px, benchmark 1920×1080):
 * - Edge-to-edge atmospheric light-blue environment filling 100vw × 100vh.
 * - Multi-layered organic SVG waves extending across the full 1920px bottom.
 * - Foreground content centered within a ~1600px content band:
 *     Left (~57%): MaslogCare Heart logo + brand title + subtitle + description + accent + 3 feature rows
 *     Right (~43%): Floating white Auth Card (~446px)
 * - Fits naturally at 1920×1080 without unwanted scrolling.
 *
 * ANDROID MOBILE (<768px):
 * - Real full device screen with safe-area insets.
 * - Stacked layout: Hero photograph + centered Brand → Wave transition → White Auth Card.
 */
export default function MaslogCareLandingScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);

  const isDesktop = width >= BREAKPOINTS.desktop;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;

  const handleOpenRegister = () => setIsRegistrationVisible(true);
  const handleCloseRegister = () => setIsRegistrationVisible(false);

  // ──────────────────────────────────────────────────────────────
  // DESKTOP & TABLET LAYOUT
  // ──────────────────────────────────────────────────────────────
  if (isDesktop || isTablet) {
    // The full-scale desktop typography is tuned for the 1920×1080 benchmark.
    // Shorter or narrower desktops (1366×768, 1440×900) step down a density so
    // the whole composition still fits above the wave band without clipping.
    const isCompactDesktop = !isDesktop || width < 1600 || height < 900;
    const waveHeight = desktopWaveHeight(isCompactDesktop);

    // At 1920×1080 this yields a ~1600px content band centred in the viewport,
    // matching the approved desktop design's side margins.
    const contentMaxWidth = isDesktop ? 1640 : 960;
    const horizontalPadding = isDesktop
      ? width >= 1780
        ? 20
        : width >= 1400
        ? 48
        : 32
      : 20;

    return (
      <View style={styles.desktopRoot}>
        {/* Full-viewport background layer */}
        <LandingBackground variant="desktop" />

        {/* Full-viewport bottom waves */}
        <WaveDecoration variant="desktop" compact={isCompactDesktop} />

        {/* Foreground scrollable content */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.desktopScrollContent,
            {
              paddingTop: Math.max(insets.top, 24),
              // Reserve part of the wave band so the vertically-centred
              // content always clears the decorative crests.
              paddingBottom: Math.max(insets.bottom, 24) + waveHeight * 0.6,
              minHeight: height,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Centered internal content container */}
          <View
            style={[
              styles.desktopContentContainer,
              {
                maxWidth: contentMaxWidth,
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            {/* Left information zone (57%) */}
            <View style={styles.desktopLeftColumn}>
              <MaslogCareBrand variant="desktop" compact={isCompactDesktop} />
              <DesktopInfoPanel compact={isCompactDesktop} />
            </View>

            {/* Right authentication zone (43%) */}
            <View style={styles.desktopRightColumn}>
              <AuthCard
                onOpenRegister={handleOpenRegister}
                compact={isCompactDesktop}
              />
            </View>
          </View>
        </ScrollView>

        <RegistrationModal
          visible={isRegistrationVisible}
          onClose={handleCloseRegister}
        />
      </View>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // ANDROID MOBILE LAYOUT
  // ──────────────────────────────────────────────────────────────
  return (
    <View style={[styles.mobileRoot, { backgroundColor: "#F2F7FD" }]}>
      {/* The hero is light, so dark system icons stay readable over it. */}
      {Platform.OS !== "web" && <StatusBar style="dark" translucent />}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.mobileScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ── Top Hero & Branding Section ── */}
          <View
            style={[
              styles.mobileHeroSection,
              {
                minHeight: Math.max(height * 0.38, 296),
                paddingBottom: WAVE_HEIGHT_MOBILE,
              },
            ]}
          >
            {/* Hero background */}
            <LandingBackground variant="mobile" />

            {/* Centered Branding — the only element that takes the top inset,
                so the hero photograph still runs under the status bar. */}
            <View
              style={[
                styles.mobileBrandWrapper,
                { paddingTop: Math.max(insets.top, 20) + 12 },
              ]}
            >
              <MaslogCareBrand variant="mobile" />
            </View>

            {/* Wave transition directly bridging hero into auth card area */}
            <WaveDecoration variant="mobile" />
          </View>

          {/* ── Mobile Authentication Card ── */}
          <View
            style={[
              styles.mobileCardWrapper,
              {
                marginHorizontal: width < 360 ? 14 : width < 400 ? 16 : 20,
                // The wave's front layer is filled with the page background,
                // so overlapping its solid tail closes the gap between the
                // hero and the card without any visible seam.
                marginTop: -Math.round(WAVE_HEIGHT_MOBILE * 0.34),
              },
            ]}
          >
            <AuthCard onOpenRegister={handleOpenRegister} isMobile />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RegistrationModal
        visible={isRegistrationVisible}
        onClose={handleCloseRegister}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  // ── Desktop ──
  desktopRoot: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F2F7FD",
    ...Platform.select({
      web: {
        minHeight: "100vh",
        overflowX: "hidden",
      } as any,
    }),
  },
  desktopScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  desktopContentContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "auto",
  },
  desktopLeftColumn: {
    width: "57%",
    gap: 26,
    paddingRight: 40,
  },
  desktopRightColumn: {
    width: "43%",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  // ── Mobile ──
  mobileRoot: {
    flex: 1,
  },
  mobileScrollContent: {
    flexGrow: 1,
  },
  mobileHeroSection: {
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  mobileBrandWrapper: {
    zIndex: 2,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mobileCardWrapper: {
    zIndex: 3,
    marginBottom: 16,
  },
});
