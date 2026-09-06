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
import { BREAKPOINTS } from "@/constants/breakpoints";
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
 * - Foreground content centered within a 1440px max-width container:
 *     Left (~57%): MaslogCare Heart logo + brand title + subtitle + description + accent + 3 feature rows
 *     Right (~43%): Floating white Auth Card (~446px)
 * - Fits naturally at 1920×1080 without unwanted scrolling.
 *
 * ANDROID MOBILE (<768px):
 * - Real full device screen with safe-area insets.
 * - Stacked layout: Centered Brand + Subtitle → Hero region → Wave transition → White Auth Card.
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
    const contentMaxWidth = isDesktop ? 1440 : 960;
    const horizontalPadding = isDesktop
      ? width >= 1800
        ? 64
        : width >= 1400
        ? 48
        : 28
      : 20;

    return (
      <View style={styles.desktopRoot}>
        {/* Full-viewport background layer */}
        <LandingBackground variant="desktop" />

        {/* Full-viewport bottom waves */}
        <WaveDecoration variant="desktop" />

        {/* Foreground scrollable content */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.desktopScrollContent,
            {
              paddingTop: Math.max(insets.top, 24),
              paddingBottom: Math.max(insets.bottom, 24),
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
              <MaslogCareBrand variant="desktop" />
              <DesktopInfoPanel />
            </View>

            {/* Right authentication zone (43%) */}
            <View style={styles.desktopRightColumn}>
              <AuthCard onOpenRegister={handleOpenRegister} />
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
                paddingTop: Math.max(insets.top, 20) + 14,
                minHeight: Math.max(height * 0.31, 235),
                paddingBottom: 75,
              },
            ]}
          >
            {/* Hero background */}
            <LandingBackground variant="mobile" />

            {/* Centered Branding */}
            <View style={styles.mobileBrandWrapper}>
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
                marginTop: Math.min(Math.max(height * 0.032, 22), 34),
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
    gap: 28,
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
    paddingBottom: 50,
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
