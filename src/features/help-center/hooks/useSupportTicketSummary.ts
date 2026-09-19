import { useEffect, useState } from "react";

import { fetchMySupportTickets } from "../services/supportService";
import { buildSupportBadgeLabel } from "../utils/support.utils";
import type { SupportStatus } from "../types/support.types";

type SupportTicketSummary = {
  counts: Partial<Record<SupportStatus, number>>;
  total: number;
  badgeLabel?: string;
  loading: boolean;
  unavailable: boolean;
};

const BADGE_FETCH_LIMIT = 1;

/** Fetches one ticket purely to read the aggregate counts the endpoint returns alongside it. */
export const useSupportTicketSummary = (enabled: boolean): SupportTicketSummary => {
  const [counts, setCounts] = useState<Partial<Record<SupportStatus, number>>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    void (async () => {
      try {
        const page = await fetchMySupportTickets(1, BADGE_FETCH_LIMIT);
        if (!active) return;

        setCounts(page.statusCounts ?? {});
        setTotal(page.total);
        setUnavailable(false);
      } catch {
        if (active) setUnavailable(true);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [enabled]);

  return {
    counts,
    total,
    badgeLabel: buildSupportBadgeLabel(counts),
    loading,
    unavailable,
  };
};
