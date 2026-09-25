import { useCallback, useEffect, useState } from "react";
import type { UserRole } from "@/config/roleRoutes";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { fetchProfileInsights } from "../services/profileInsightsService";
import type { ProfileInsights, ProfileInsightsState } from "../types/profile.types";

const EMPTY_INSIGHTS: ProfileInsights = {
  stats: [],
  appointments: [],
  records: [],
  activity: [],
};

const FALLBACK_ERROR =
  "We could not load your profile activity right now. Please try again.";

export const useProfileInsights = (role?: UserRole | null): ProfileInsightsState => {
  const [insights, setInsights] = useState<ProfileInsights>(EMPTY_INSIGHTS);
  const [loading, setLoading] = useState(Boolean(role));
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!role) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
      setInsights(EMPTY_INSIGHTS);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProfileInsights(role)
      .then((result) => {
        if (cancelled) return;
        setInsights(result);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setInsights(EMPTY_INSIGHTS);
        setError(getApiErrorMessage(requestError, FALLBACK_ERROR));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [role, reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { ...insights, loading, error, reload };
};
