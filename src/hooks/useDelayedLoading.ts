import { useEffect, useRef, useState } from "react";

const DEFAULT_DELAY_MS = 120;

const DEFAULT_MIN_VISIBLE_MS = 200;

export const useDelayedLoading = (
  active: boolean,
  options?: { delayMs?: number; minVisibleMs?: number }
): boolean => {
  const delayMs = options?.delayMs ?? DEFAULT_DELAY_MS;
  const minVisibleMs = options?.minVisibleMs ?? DEFAULT_MIN_VISIBLE_MS;

  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (active) {
      if (visible) return;

      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, delayMs);

      return () => clearTimeout(timer);
    }

    if (!visible) return;

    const remaining = minVisibleMs - (Date.now() - shownAt.current);
    if (remaining <= 0) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(false), remaining);
    return () => clearTimeout(timer);
  }, [active, visible, delayMs, minVisibleMs]);

  return visible;
};
