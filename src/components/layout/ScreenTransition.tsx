import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";
import { usePathname } from "expo-router";
import PageLoader from "@/components/feedback/PageLoader";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import { DURATION, ENTER_OFFSET, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

const useIsomorphicLayoutEffect = Platform.OS === "web" ? useLayoutEffect : useEffect;

const FILL = { flex: 1, width: "100%", minWidth: 0 } as const;

const ScreenTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const opacity = useAnimatedValue(1);
  const translateY = useAnimatedValue(0);

  const [settling, setSettling] = useState(false);

  const showLoader = useDelayedLoading(settling);

  const enabled = Platform.OS === "web" && !reducedMotion;

  const animatedFor = useRef(pathname);
  const mounted = useRef(false);
  const settledFor = useRef(pathname);

  useIsomorphicLayoutEffect(() => {
    if (!enabled || !mounted.current || animatedFor.current === pathname) return;

    animatedFor.current = pathname;
    opacity.setValue(0);
    translateY.setValue(ENTER_OFFSET);
  }, [enabled, pathname, opacity, translateY]);

  useEffect(() => {
    mounted.current = true;

    if (!enabled) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: DURATION.screen,
        easing: Easing.out(Easing.quad),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: DURATION.screen,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [enabled, pathname, opacity, translateY]);

  useEffect(() => {
    if (settledFor.current === pathname) return;
    settledFor.current = pathname;

    setSettling(true);

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setSettling(false));
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      setSettling(false);
    };
  }, [pathname]);

  return (
    <View style={FILL}>
      {enabled ? (
        <Animated.View style={[FILL, { opacity, transform: [{ translateY }] }]}>
          {children}
        </Animated.View>
      ) : (
        <View style={FILL}>{children}</View>
      )}

      {showLoader ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "transparent", pointerEvents: "none" },
          ]}
        >
          <PageLoader showLabel={false} />
        </View>
      ) : null}
    </View>
  );
};

export default ScreenTransition;
