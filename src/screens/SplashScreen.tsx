import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingDots from "@/components/splash/LoadingDots";
import SplashBackdrop from "@/components/splash/SplashBackdrop";
import { SPLASH_COLORS, SPLASH_TIMING } from "@/components/splash/splashTheme";

/**
 * The Barangay 61 Maslog seal, as supplied with the project.
 *
 * Rendered from the real asset at its native 1:1 with `resizeMode="contain"`,
 * so it is never stretched, cropped or stood in for.
 */
const MASLOG_SEAL = require("../../assets/images/maslogicon.png");

type SplashScreenProps = {
  /** Drives the cross-fade out once startup has finished. */
  visible: boolean;
};

/**
 * MaslogCare startup screen.
 *
 * Shown while the app resolves its stored session, then cross-faded away. It is
 * an overlay rather than a route: there is no screen to navigate back to, which
 * is what guarantees Android Back can never return here.
 *
 * Every animation runs on the native driver so the entrance stays smooth while
 * the JS thread is busy with initialisation.
 */
const SplashScreen = ({ visible }: SplashScreenProps) => {
  const { width } = useWindowDimensions();

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;

  // Sized from the viewport so a small phone does not get a seal that crowds
  // the wordmark, kept inside the brief's 150–190px band.
  const sealSize = Math.min(190, Math.max(150, width * 0.46));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: SPLASH_TIMING.fadeIn,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: SPLASH_TIMING.logoIn,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: SPLASH_TIMING.logoIn,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(SPLASH_TIMING.wordmarkDelay),
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: SPLASH_TIMING.wordmarkIn,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [screenOpacity, logoOpacity, logoScale, wordmarkOpacity]);

  // Fade the whole screen out once the app is ready, so the landing page
  // appears through it instead of replacing it in one frame.
  useEffect(() => {
    if (visible) return;
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: SPLASH_TIMING.fadeOut,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, screenOpacity]);

  return (
    <Animated.View
      // Sits above the routed content until it has faded out.
      style={{ ...StyleSheetAbsolute, opacity: screenOpacity }}
      pointerEvents={visible ? "auto" : "none"}
    >
      <View className="flex-1" style={{ backgroundColor: SPLASH_COLORS.base }}>
        <SplashBackdrop />

        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          {/* Centred as a block, so the composition holds on any screen height
              instead of being pinned with fixed offsets. */}
          <View className="flex-[3] items-center justify-center px-8">
            <Animated.View className="items-center" style={{ opacity: wordmarkOpacity }}>
              <Text
                className="text-center text-[19px] font-semibold italic"
                style={{ color: SPLASH_COLORS.tagline, lineHeight: 28 }}
              >
                A Healthier,{"\n"}Stronger Maslog{"\n"}Together
              </Text>
              <View
                className="mt-3 rounded-full"
                style={{ width: 96, height: 2, backgroundColor: SPLASH_COLORS.foliage }}
              />
            </Animated.View>

            <Animated.View
              className="my-9"
              style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
            >
              <Image
                source={MASLOG_SEAL}
                accessibilityRole="image"
                accessibilityLabel="Barangay 61 Maslog, Legazpi City official seal"
                resizeMode="contain"
                style={{ width: sealSize, height: sealSize }}
              />
            </Animated.View>

            <Animated.View className="items-center" style={{ opacity: wordmarkOpacity }}>
              <Text className="text-[34px] font-extrabold" accessibilityRole="header">
                <Text style={{ color: SPLASH_COLORS.brandBlue }}>Maslog</Text>
                <Text style={{ color: SPLASH_COLORS.brandGreen }}>Care</Text>
              </Text>

              <Text
                className="mt-2 text-[11px] font-semibold"
                style={{ color: SPLASH_COLORS.eyebrow, letterSpacing: 2.4 }}
              >
                PEOPLE • HEALTH • COMMUNITY
              </Text>
            </Animated.View>
          </View>

          {/* Anchored low rather than centred, matching the design, but inside
              the safe area so it clears the Android navigation bar. */}
          <View className="flex-1 items-center justify-start pb-8">
            <LoadingDots />
            <Text
              className="mt-4 text-[13px] font-medium"
              style={{ color: SPLASH_COLORS.loadingText, letterSpacing: 1.2 }}
            >
              Loading...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Animated.View>
  );
};

/** Full-bleed overlay geometry — the one thing NativeWind cannot express here. */
const StyleSheetAbsolute = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 50,
};

export default SplashScreen;
