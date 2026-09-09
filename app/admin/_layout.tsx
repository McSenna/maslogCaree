import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  adminNavItems,
  adminBottomNavItems,
} from "@/config/roleNavConfig";

const AdminLayout = () => {
  return (
    <RouteGuard role="admin">
      <RoleLayout
        sidebarItems={adminNavItems}
        bottomNavItems={adminBottomNavItems}
        roleLabel="Admin"
      >
        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      </RoleLayout>
    </RouteGuard>
  );
}

export default AdminLayout