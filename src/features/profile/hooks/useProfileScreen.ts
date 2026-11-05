import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, type ProfileState } from "./useProfile";
import { useProfileRefresh, type ProfileRefreshState } from "./useProfileRefresh";

export type ProfileScreenState = ProfileState & ProfileRefreshState & { reloadAll: () => void };

export const useProfileScreen = (enabled = true): ProfileScreenState => {
  const { user } = useAuth();
  const profileState = useProfile();
  const refresh = useProfileRefresh(enabled && Boolean(user));
  const { refreshProfile } = refresh;

  const reloadAll = useCallback(() => refreshProfile(), [refreshProfile]);

  return { ...profileState, ...refresh, reloadAll };
};
