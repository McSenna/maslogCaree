import { Redirect, Stack, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import RoleLayout from "@/components/layout/RoleLayout";
import { getDashboardPath } from "@/data/mockUsers";
import {
  adminNavItems,
  adminBottomNavItems,
} from "@/config/roleNavConfig";

const AdminLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "admin") {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return (
    <RoleLayout
      sidebarItems={adminNavItems}
      bottomNavItems={adminBottomNavItems}
      roleLabel="Admin"
    >
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </RoleLayout>
  );
}

export default AdminLayout