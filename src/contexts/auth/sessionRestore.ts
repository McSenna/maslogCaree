import { useEffect, useLayoutEffect } from "react";

import { CLIENT_PLATFORM, isPlatformAllowed } from "@/config/platformAccess";
import { getTokenPlatform, isTokenValid } from "@/services/auth";
import { getStoredUser, type StoredUser } from "@/utils/storage";
import type { UserRole } from "@/data/mockUsers";

export const canUseDOM =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

const ALLOWED_ROLES: UserRole[] = ["admin", "doctor", "midwife", "bhw", "resident"];

export type RestoreDecision =
  | { action: "restore"; stored: StoredUser }
  | { action: "logout" }
  | { action: "none" };

export const decideSessionRestore = (): RestoreDecision => {
  const adminNoTokenSession = process.env.EXPO_PUBLIC_ADMIN_NO_TOKEN_SESSION === "1";
  const stored = getStoredUser();

  const tokenOk = Boolean(stored?.token && isTokenValid(stored.token));
  const adminWithoutToken =
    adminNoTokenSession &&
    stored?.role === "admin" &&
    (!stored.token || stored.token.length === 0);

  const platformOk =
    Boolean(stored) &&
    isPlatformAllowed(stored?.role, CLIENT_PLATFORM) &&
    (!stored?.token || (getTokenPlatform(stored.token) ?? CLIENT_PLATFORM) === CLIENT_PLATFORM);

  if (
    stored &&
    ALLOWED_ROLES.includes(stored.role as UserRole) &&
    platformOk &&
    (tokenOk || adminWithoutToken)
  ) {
    return { action: "restore", stored };
  }

  if (stored && !adminWithoutToken) return { action: "logout" };
  return { action: "none" };
};
