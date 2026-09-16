import { useEffect, type ReactNode } from "react";
import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { forceLogout } from "@/services/authEvents";
import { getDashboardPath, type UserRole } from "@/data/mockUsers";
import { isBlockedOnThisPlatform } from "@/config/platformAccess";
import PageLoader from "@/components/feedback/PageLoader";

type RouteGuardProps = {
  role: UserRole;
  children: ReactNode;
};

const RouteGuard = ({ role, children }: RouteGuardProps) => {
  const { user, isLoading } = useAuth();

  const blockedOnPlatform = Boolean(user) && isBlockedOnThisPlatform(user?.role);

  useEffect(() => {
    if (blockedOnPlatform) {
      void forceLogout();
    }
  }, [blockedOnPlatform]);

  if (isLoading && !user) {

    return <PageLoader showLabel={false} />;
  }

  if (!user || blockedOnPlatform) {
    return <Redirect href="/" />;
  }

  if (user.role !== role) {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return <>{children}</>;
};

export default RouteGuard;
