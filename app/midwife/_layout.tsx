import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  midwifeNavItems,
  midwifeBottomNavItems,
} from "@/config/roleNavConfig";

export default function MidwifeLayout() {
  return (
    <RouteGuard role="midwife">
      <RoleLayout
        sidebarItems={midwifeNavItems}
        bottomNavItems={midwifeBottomNavItems}
        roleLabel="MidWife"
      >
        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      </RoleLayout>
    </RouteGuard>
  );
}
