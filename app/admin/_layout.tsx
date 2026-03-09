import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import RoleLayout from "../../components/layout/RoleLayout";
import {
  adminNavItems,
  adminBottomNavItems,
} from "../../config/roleNavConfig";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "admin") {
    const { getDashboardPath } = require("../../data/mockUsers");
    return <Redirect href={getDashboardPath(user.role)} />;
  }

  return (
    <RoleLayout
      sidebarItems={adminNavItems}
      bottomNavItems={adminBottomNavItems}
      roleLabel="Admin"
    >
      <Stack screenOptions={{ headerShown: false }} />
    </RoleLayout>
  );
}
