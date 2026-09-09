import { useEffect } from "react";
import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { isBlockedOnThisPlatform } from "@/config/platformAccess";
import { forceLogout } from "@/services/authEvents";
import MaslogCareLandingScreen from "@/screens/MaslogCareLandingScreen";

/**
 * Public index — MaslogCare landing / login page.
 *
 * Authenticated users are redirected to their role dashboard, but only when
 * their role may use this client. A session that cannot be used here is
 * cleared rather than redirected: sending it to a dashboard the route guard
 * would immediately bounce back would loop between the two screens.
 */
const Index = () => {
  const { user, isLoading } = useAuth();

  const blockedOnPlatform = Boolean(user) && isBlockedOnThisPlatform(user?.role);

  useEffect(() => {
    if (blockedOnPlatform) {
      void forceLogout();
    }
  }, [blockedOnPlatform]);

  // Redirect authenticated users
  if (!isLoading && user && !blockedOnPlatform) {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return <MaslogCareLandingScreen />;
};

export default Index;
