import { useEffect } from "react";
import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { isBlockedOnThisPlatform } from "@/config/platformAccess";
import { forceLogout } from "@/services/authEvents";
import MaslogCareLandingScreen from "@/screens/MaslogCareLandingScreen";

const Index = () => {
  const { user, isLoading } = useAuth();

  const blockedOnPlatform = Boolean(user) && isBlockedOnThisPlatform(user?.role);

  useEffect(() => {
    if (blockedOnPlatform) {
      void forceLogout();
    }
  }, [blockedOnPlatform]);

  if (!isLoading && user && !blockedOnPlatform) {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return <MaslogCareLandingScreen />;
};

export default Index;
