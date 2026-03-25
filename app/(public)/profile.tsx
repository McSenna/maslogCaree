import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getProfilePath } from "@/data/mockUsers";

/**
 * Public profile route: redirects authenticated users to their role-specific
 * profile screen; unauthenticated users are sent to home.
 */
export default function ProfileRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Redirect href={getProfilePath(user.role) as Href} />;
  }

  return <Redirect href="/" />;
}
