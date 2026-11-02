import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";
import { permissionForAccount, type PermissionProfile } from "./permissionIdentity";

const WebAccessPermissionContext = createContext(false);
const PERMISSION_RESOURCES = ["user"] as const;

/**
 * Asks the server whether this account may change resident web access. The answer only
 * decides which controls show, and stays false until the server says otherwise.
 */
const AccountWebAccessPermission = ({ accountId, children }: { accountId: string | null; children: ReactNode }) => {
  const [profile, setProfile] = useState<PermissionProfile | null>(null);
  const [refresh, setRefresh] = useState(0);
  useRealtimeRefetch(PERMISSION_RESOURCES, () => setRefresh((version) => version + 1), { enabled: accountId !== null });

  useEffect(() => {
    let active = true;
    if (!accountId) return;
    api
      .get<PermissionProfile>("/profile")
      .then(({ data }) => {
        if (active) setProfile(data);
      })
      .catch(() => {
        if (active) setProfile(null);
      });
    return () => {
      active = false;
    };
  }, [accountId, refresh]);

  return <WebAccessPermissionContext.Provider value={permissionForAccount(accountId, profile)}>{children}</WebAccessPermissionContext.Provider>;
};

export const WebAccessPermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const accountId = !isLoading && user ? String(user.id) : null;
  // Remount the permission fetch on every account transition, including sign-out.
  return <AccountWebAccessPermission key={accountId ?? "signed-out"} accountId={accountId}>{children}</AccountWebAccessPermission>;
};

export const useCanManageWebAccess = (): boolean => useContext(WebAccessPermissionContext);
