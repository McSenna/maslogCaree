import { Redirect, Stack, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import RoleLayout from "@/components/layout/RoleLayout";
import { getDashboardPath } from "@/data/mockUsers";
import {
  bhwNavItems,
  bhwBottomNavItems,
} from "@/config/roleNavConfig";

const BhwLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "bhw") {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return (
    <RoleLayout
      sidebarItems={bhwNavItems}
      bottomNavItems={bhwBottomNavItems}
      roleLabel="BHW"
    >
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </RoleLayout>
  );
}

export default BhwLayout;
