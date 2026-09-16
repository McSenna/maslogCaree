import { useEffect, useMemo, useState } from "react";
import type { UserRole } from "@/data/mockUsers";
import { getProfileTabsForRole, type ProfileTabDefinition } from "../config/profileTabs";
import type { ProfileTabKey } from "../types/profile.types";

export type ProfileTabsState = {
  tabs: ProfileTabDefinition[];
  activeTab: ProfileTabKey;
  selectTab: (key: ProfileTabKey) => void;
};

export const useProfileTabs = (role?: UserRole | null): ProfileTabsState => {
  const tabs = useMemo(() => getProfileTabsForRole(role), [role]);
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("overview");

  useEffect(() => {
    const permitted = tabs.some((tab) => tab.key === activeTab);
    if (!permitted) setActiveTab("overview");
  }, [tabs, activeTab]);

  return { tabs, activeTab, selectTab: setActiveTab };
};
