import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import MaslogCareLandingScreen from "@/screens/MaslogCareLandingScreen";

/**
 * Public index — MaslogCare landing / login page.
 *
 * Authenticated users are redirected to their role dashboard.
 * Unauthenticated users see the full-screen landing page with
 * embedded login form.
 */
const Index = () => {
  const { user, isLoading } = useAuth();

  // Redirect authenticated users
  if (!isLoading && user) {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return <MaslogCareLandingScreen />;
};

export default Index;