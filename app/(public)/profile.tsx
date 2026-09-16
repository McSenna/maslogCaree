import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getProfilePath } from "@/data/mockUsers";

const ProfileRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Redirect href={getProfilePath(user.role) as Href} />;
  }

  return <Redirect href="/" />;
};

export default ProfileRedirect;
