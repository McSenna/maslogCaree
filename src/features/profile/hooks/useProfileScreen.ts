import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isResidentRole } from "../config/profileTabs";
import type { ProfileInsightsState } from "../types/profile.types";
import { useProfile, type ProfileState } from "./useProfile";
import { useProfileInsights } from "./useProfileInsights";
import { useProfileRefresh, type ProfileRefreshState } from "./useProfileRefresh";
import { useProfileTabs, type ProfileTabsState } from "./useProfileTabs";

export type ProfileScreenState = ProfileState &
  ProfileRefreshState & {
    insights: ProfileInsightsState;
    tabs: ProfileTabsState;
    isResident: boolean;
    reloadAll: () => void;
  };

export const useProfileScreen = (): ProfileScreenState => {
  const { user } = useAuth();
  const profileState = useProfile();

  const role = user?.role ?? null;
  const refresh = useProfileRefresh(Boolean(user));
  const insights = useProfileInsights(role);
  const tabs = useProfileTabs(role);

  const reloadAll = useCallback(() => {
    refresh.refreshProfile();
    insights.reload();
  }, [refresh, insights]);

  return {
    ...profileState,
    ...refresh,
    insights,
    tabs,
    isResident: isResidentRole(role),
    reloadAll,
  };
};
