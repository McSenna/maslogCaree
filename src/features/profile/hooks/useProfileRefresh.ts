import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeEvents } from "@/hooks/realtime/useRealtimeEvents";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getCachedAccessToken } from "@/utils/storage";
import { getMyProfile } from "../services/profileService";

const FALLBACK_ERROR = "We could not refresh your profile. Showing your saved details.";

export type ProfileRefreshState = {
  refreshing: boolean;
  refreshError: string | null;
  refreshProfile: () => void;
};

export const useProfileRefresh = (enabled: boolean): ProfileRefreshState => {
  const { applyAuthUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    setRefreshing(true);
    setRefreshError(null);

    getMyProfile()
      .then((user) => {
        if (cancelled) return;
        const token = getCachedAccessToken();
        if (token) applyAuthUser(user, token);
      })
      .catch((error: unknown) => {
        if (!cancelled) setRefreshError(getApiErrorMessage(error, FALLBACK_ERROR));
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadToken, applyAuthUser]);

  const refreshProfile = useCallback(() => setReloadToken((token) => token + 1), []);

  // An edit saved on another device (or by an admin) shows here at once. The
  // pushed record is the same shape GET /profile returns, applied the same way.
  useRealtimeEvents(
    "profile",
    (change) => {
      if (change.action === "resync") return refreshProfile();
      if (change.action === "deleted") return;
      const token = getCachedAccessToken();
      if (token) applyAuthUser(change.record, token);
    },
    enabled
  );

  return { refreshing, refreshError, refreshProfile };
};
