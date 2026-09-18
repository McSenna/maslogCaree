import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingDots from "@/components/splash/LoadingDots";
import SplashBackdrop from "@/components/splash/SplashBackdrop";
import { SPLASH_COLORS, SPLASH_TIMING } from "@/components/splash/splashTheme";
import { USE_NATIVE_DRIVER } from "@/design/motion";

const MASLOG_SEAL = require("../../assets/images/maslogicon.png");

type SplashScreenProps = {
  visible: boolean;
};

const SplashScreen = ({ visible }: SplashScreenProps) => {
  const { width } = useWindowDimensions();

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;

  const sealSize = Math.min(190, Math.max(150, width * 0.46));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: SPLASH_TIMING.fadeIn,
        easing: Easing.out(Easing.quad),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: SPLASH_TIMING.logoIn,
        easing: Easing.out(Easing.quad),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: SPLASH_TIMING.logoIn,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.sequence([
        Animated.delay(SPLASH_TIMING.wordmarkDelay),
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: SPLASH_TIMING.wordmarkIn,
          easing: Easing.out(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    ]).start();
  }, [screenOpacity, logoOpacity, logoScale, wordmarkOpacity]);

  useEffect(() => {
    if (visible) return;
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: SPLASH_TIMING.fadeOut,
      easing: Easing.in(Easing.quad),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [visible, screenOpacity]);

  return (
    <Animated.View
      style={{
        ...StyleSheetAbsolute,
        opacity: screenOpacity,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <View className="flex-1" style={{ backgroundColor: SPLASH_COLORS.base }}>
        <SplashBackdrop />

        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
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
                resizeMethod="resize"
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

const StyleSheetAbsolute = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 50,
};

export default SplashScreen;
