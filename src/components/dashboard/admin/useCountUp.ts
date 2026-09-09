import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, InteractionManager } from "react-native";

const DURATION_MS = 700;
/** ~30fps is smooth enough for a counter and cheap on a mid-range Android. */
const FRAME_MS = 33;

/**
 * Counts from 0 up to `value` once, then tracks `value` exactly.
 *
 * Driven by an interval rather than Animated because the result is rendered as
 * formatted text, not a style. Respects "reduce motion" and always lands on the
 * true value, so the number on screen is never a rounded-off approximation.
 */
export function useCountUp(value: number): number {
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
        // easeOutCubic — fast start, gentle settle.
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
}
