import { useMemo, useState } from "react";
import type { UserRole } from "@/config/roleRoutes";
import { getProfileTabsForRole, type ProfileTabDefinition } from "../config/profileTabs";
import type { ProfileTabKey } from "../types/profile.types";

export type ProfileTabsState = {
  tabs: ProfileTabDefinition[];
  activeTab: ProfileTabKey;
  selectTab: (key: ProfileTabKey) => void;
};

export const useProfileTabs = (role?: UserRole | null): ProfileTabsState => {
  const tabs = useMemo(() => getProfileTabsForRole(role), [role]);
  const [selectedTab, setSelectedTab] = useState<ProfileTabKey>("overview");

  // Fall back to the overview when the selected tab isn't available for this role.
  const activeTab = tabs.some((tab) => tab.key === selectedTab) ? selectedTab : "overview";

  return { tabs, activeTab, selectTab: setSelectedTab };
};
