import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import { screenTransition, useReducedMotion } from "@/design/motion";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  adminNavItems,
  adminBottomNavItems,
} from "@/config/roleNavConfig";

const AdminLayout = () => {
  const reducedMotion = useReducedMotion();
  return (
    <RoleLayout
      sidebarItems={adminNavItems}
      bottomNavItems={adminBottomNavItems}
      roleLabel="Admin"
    >
      <RouteGuard role="admin">
        <Stack screenOptions={{ headerShown: false, ...screenTransition(reducedMotion) }} />
      </RouteGuard>
    </RoleLayout>
  );
}

export default AdminLayout