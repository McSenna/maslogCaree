import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";

export const DURATION = {
  instant: 120,
  screen: 220,
  exit: 180,
} as const;

export const ENTER_OFFSET = 6;

export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;

    if (Platform.OS === "web") {
      if (typeof window === "undefined" || !window.matchMedia) return;

      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(query.matches);

      const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    }

    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => {
      });

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

type StackAnimation = "none" | "fade" | "slide_from_right";

export type ScreenTransition = {
  animation: StackAnimation;
  animationDuration: number;
};

export const screenTransition = (reducedMotion: boolean): ScreenTransition => {
  if (reducedMotion || Platform.OS === "web") {
    return { animation: "none", animationDuration: 0 };
  }

  return { animation: "slide_from_right", animationDuration: DURATION.screen };
};
