import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import RoleLayout from "../../components/layout/RoleLayout";
import {
  residentNavItems,
  residentBottomNavItems,
} from "../../config/roleNavConfig";

export default function ResidentLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "resident") {
    const { getDashboardPath } = require("../../data/mockUsers");
    return <Redirect href={getDashboardPath(user.role)} />;
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
