import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, InteractionManager } from "react-native";

const DURATION_MS = 700;
const FRAME_MS = 33;

export const useCountUp = (value: number): number => {
  const [display, setDisplay] = useState(value);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) {
      setDisplay(value);
      return;
    }
    hasAnimatedRef.current = true;

    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const run = async () => {
      let reduceMotion = false;
      try {
        reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      } catch {
        reduceMotion = false;
      }

      if (cancelled) return;
      if (reduceMotion || value <= 0) {
        setDisplay(value);
        return;
      }

      const startedAt = Date.now();
      timer = setInterval(() => {
        const progress = Math.min(1, (Date.now() - startedAt) / DURATION_MS);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress >= 1 && timer) {
          clearInterval(timer);
          timer = null;
          setDisplay(value);
        }
      }, FRAME_MS);
    };

    const task = InteractionManager.runAfterInteractions(run);

    return () => {
      cancelled = true;
      task.cancel();
      if (timer) clearInterval(timer);
    };
  }, [value]);

  return display;
};
