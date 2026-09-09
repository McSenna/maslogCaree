import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  bhwNavItems,
  bhwBottomNavItems,
} from "@/config/roleNavConfig";

const BhwLayout = () => {
  return (
    <RouteGuard role="bhw">
      <RoleLayout
        sidebarItems={bhwNavItems}
        bottomNavItems={bhwBottomNavItems}
        roleLabel="BHW"
      >
        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      </RoleLayout>
    </RouteGuard>
  );
}

export default BhwLayout;
