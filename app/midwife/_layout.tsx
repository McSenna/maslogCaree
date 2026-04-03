import { Redirect, Stack, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import RoleLayout from "@/components/layout/RoleLayout";
import { getDashboardPath } from "@/data/mockUsers";
import {
  midwifeNavItems,
  midwifeBottomNavItems,
} from "@/config/roleNavConfig";

export default function MidwifeLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "midwife") {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return (
    <RoleLayout
      sidebarItems={midwifeNavItems}
      bottomNavItems={midwifeBottomNavItems}
      roleLabel="MaslogCare"
    >
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </RoleLayout>
  );
}
