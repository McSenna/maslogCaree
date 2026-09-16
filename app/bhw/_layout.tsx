import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import { screenTransition, useReducedMotion } from "@/design/motion";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  bhwNavItems,
  bhwBottomNavItems,
} from "@/config/roleNavConfig";

const BhwLayout = () => {
  const reducedMotion = useReducedMotion();
  return (
    <RoleLayout
      sidebarItems={bhwNavItems}
      bottomNavItems={bhwBottomNavItems}
      roleLabel="BHW"
    >
      <RouteGuard role="bhw">
        <Stack screenOptions={{ headerShown: false, ...screenTransition(reducedMotion) }} />
      </RouteGuard>
    </RoleLayout>
  );
}

export default BhwLayout;
