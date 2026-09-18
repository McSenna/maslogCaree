import { useEffect, useState } from "react";

const TICK_MS = 60_000;

/**
 * Ticks once a minute so relative timestamps ("5 min ago") stay truthful while
 * a list is left open, without every row keeping its own timer.
 */
export const useRelativeClock = (enabled = true): number => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, [enabled]);

  return now;
};
