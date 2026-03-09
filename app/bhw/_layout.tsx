import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import RoleLayout from "../../components/layout/RoleLayout";
import {
  bhwNavItems,
  bhwBottomNavItems,
} from "../../config/roleNavConfig";

export default function BhwLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "bhw") {
    const { getDashboardPath } = require("../../data/mockUsers");
    return <Redirect href={getDashboardPath(user.role)} />;
  }

  return (
    <RoleLayout
      sidebarItems={bhwNavItems}
      bottomNavItems={bhwBottomNavItems}
      roleLabel="BHW"
    >
      <Stack screenOptions={{ headerShown: false }} />
    </RoleLayout>
  );
}
