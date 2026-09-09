import { useEffect, type ReactNode } from "react";
import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { forceLogout } from "@/services/authEvents";
import { getDashboardPath, type UserRole } from "@/data/mockUsers";
import { isBlockedOnThisPlatform } from "@/config/platformAccess";
import AuthLoadingScreen from "./AuthLoadingScreen";

type RouteGuardProps = {
  /** The role this section of the app belongs to. */
  role: UserRole;
  children: ReactNode;
};

/**
 * The gate every authenticated area of MaslogCare passes through.
 *
 * The checks run in the same order the backend uses — session, then platform,
 * then role — so the client never shows something the server would refuse to
 * serve, and never has to decide anything the server has not already decided.
 *
 * The platform check is what stops a resident reaching /dashboard by typing
 * the URL into a browser. It cannot be their only obstacle and is not meant to
 * be: the API rejects those requests too, and the session that would carry
 * them was never issued. This is the layer that keeps the screen itself from
 * rendering, which the API guard alone cannot do.
 */
export default function RouteGuard({ role, children }: RouteGuardProps) {
  const { user, isLoading } = useAuth();

  const blockedOnPlatform = Boolean(user) && isBlockedOnThisPlatform(user?.role);

  // A session that does not belong on this client is dropped, not merely
  // hidden — leaving it in storage would let a reload put the user back in
  // exactly this state.
  useEffect(() => {
    if (blockedOnPlatform) {
      void forceLogout();
    }
  }, [blockedOnPlatform]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!user || blockedOnPlatform) {
    return <Redirect href="/" />;
  }

  if (user.role !== role) {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return <>{children}</>;
}
