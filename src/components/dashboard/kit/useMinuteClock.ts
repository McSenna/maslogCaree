import { useEffect, useState } from "react";

/** The current time, refreshed once a minute, so relative labels like "Updated 4 min ago" stay true. */
export const useMinuteClock = (): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return now;
};
