import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import { screenTransition, useReducedMotion } from "@/theme/motion";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  midwifeNavItems,
  midwifeBottomNavItems,
} from "@/config/roleNavConfig";

const MidwifeLayout = () => {
  const reducedMotion = useReducedMotion();

  return (
    <RoleLayout
      sidebarItems={midwifeNavItems}
      bottomNavItems={midwifeBottomNavItems}
      roleLabel="Midwife"
    >
      <RouteGuard role="midwife">
        <Stack screenOptions={{ headerShown: false, ...screenTransition(reducedMotion) }} />
      </RouteGuard>
    </RoleLayout>
  );
};

export default MidwifeLayout;
