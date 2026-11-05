import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";
import { permissionStatus, type PermissionProfile, type PermissionStatus } from "./permissionIdentity";

type WebAccessPermission = { status: PermissionStatus; retry: () => void };

const WebAccessPermissionContext = createContext<WebAccessPermission>({ status: "denied", retry: () => undefined });
const PERMISSION_RESOURCES = ["user"] as const;

/**
 * Asks the server whether this account may change resident web access. The answer only
 * decides which controls show, and they stay hidden until the server grants it.
 */
const AccountWebAccessPermission = ({ accountId, children }: { accountId: string | null; children: ReactNode }) => {
  const [profile, setProfile] = useState<PermissionProfile | null>(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const [refresh, setRefresh] = useState(0);
  useRealtimeRefetch(PERMISSION_RESOURCES, () => setRefresh((version) => version + 1), { enabled: accountId !== null });

  useEffect(() => {
    let active = true;
    if (!accountId) return;
    api
      .get<PermissionProfile>("/profile")
      .then(({ data }) => {
        if (!active) return;
        setProfile(data);
        setRequestFailed(false);
      })
      .catch(() => {
        if (!active) return;
        setProfile(null);
        setRequestFailed(true);
      });
    return () => {
      active = false;
    };
  }, [accountId, refresh]);

  const retry = useCallback(() => {
    setRequestFailed(false);
    setRefresh((version) => version + 1);
  }, []);
  const status = permissionStatus(accountId, profile, requestFailed);
  const value = useMemo(() => ({ status, retry }), [status, retry]);

  return <WebAccessPermissionContext.Provider value={value}>{children}</WebAccessPermissionContext.Provider>;
};

export const WebAccessPermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const accountId = !isLoading && user ? String(user.id) : null;
  // Remount the permission fetch on every account transition, including sign-out.
  return <AccountWebAccessPermission key={accountId ?? "signed-out"} accountId={accountId}>{children}</AccountWebAccessPermission>;
};

export const useWebAccessPermission = (): WebAccessPermission => useContext(WebAccessPermissionContext);
export const useCanManageWebAccess = (): boolean => useWebAccessPermission().status === "granted";
