import { Redirect, Stack, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import RoleLayout from "@/components/layout/RoleLayout";
import { getDashboardPath } from "@/data/mockUsers";
import {
  residentNavItems,
  residentBottomNavItems,
} from "@/config/roleNavConfig";

const ResidentLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "resident") {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return (
    <RoleLayout
      sidebarItems={residentNavItems}
      bottomNavItems={residentBottomNavItems}
      roleLabel="Resident"
    >
      <Stack screenOptions={{ headerShown: false }} />
    </RoleLayout>
  );
}

export default ResidentLayout;