import { useEffect, useState } from "react";

import { msUntilNextAppDay } from "@/utils/serviceDays";

/**
 * The current time, re-read when the barangay's calendar day rolls over, so
 * day-gated actions (immunization on its Wednesday) unlock on a screen left
 * open overnight, such as the health center tablet, without a reload.
 */
export const useAppToday = (): Date => {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    // Wakes once, just after midnight; the extra second absorbs timer drift.
    const timer = setTimeout(() => setToday(new Date()), msUntilNextAppDay(today) + 1000);
    return () => clearTimeout(timer);
  }, [today]);

  return today;
};
