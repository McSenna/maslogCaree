import { useEffect, useState } from "react";
import { AccessibilityInfo, Easing, Platform } from "react-native";

export const EASING = {
  out: Easing.bezier(0.23, 1, 0.32, 1),
  inOut: Easing.bezier(0.77, 0, 0.175, 1),
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
  standard: Easing.bezier(0.2, 0, 0, 1),
} as const;

export const WEB_EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

export const TIMING = {
  pressIn: 100,
  pressOut: 200,
  hover: 160,
  enter: 240,
  exit: 180,
  modal: 260,
  page: 220,
} as const;

export const DURATION = {
  instant: 120,
  screen: TIMING.page,
  exit: TIMING.exit,
} as const;

export const PRESS_SCALE = 0.98;

export const ENTER_OFFSET = 6;

export const webTransition = (...properties: string[]): string =>
  properties.map((property) => `${property} ${TIMING.hover}ms ${WEB_EASE_OUT}`).join(", ");

/**
 * React Native Web has no native animated module; requesting the native driver
 * there only logs a warning before falling back to JS.
 */
export const USE_NATIVE_DRIVER = Platform.OS !== "web";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const webMotionQuery = (): MediaQueryList | null =>
  Platform.OS === "web" && typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(REDUCED_MOTION_QUERY)
    : null;

export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(() => webMotionQuery()?.matches ?? false);

  useEffect(() => {
    let active = true;

    if (Platform.OS === "web") {
      const query = webMotionQuery();
      if (!query) return;

      const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    }

    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => {});

    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) =>
      setReduced(Boolean(value))
    );

    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return reduced;
};

type StackAnimation = "none" | "fade";

export type ScreenTransition = {
  animation: StackAnimation;
  animationDuration: number;
};

/**
 * Role stacks only hold top-level destinations reached from the bottom
 * navigation, so they cross-fade like Material's fade-through pattern. A
 * sideways push would imply a hierarchy between sibling tabs that isn't there.
 * Web animates the page body in `ScreenTransition` instead.
 */
export const screenTransition = (reducedMotion: boolean): ScreenTransition =>
  reducedMotion || Platform.OS === "web"
    ? { animation: "none", animationDuration: 0 }
    : { animation: "fade", animationDuration: TIMING.page };
