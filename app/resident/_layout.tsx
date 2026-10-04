import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import { useTheme } from "@/contexts/ThemeContext";
import { screenTransition, useReducedMotion } from "@/theme/motion";
import {
  residentNavItems,
  residentBottomNavItems,
} from "@/config/roleNavConfig";

import { PALETTE } from "@/theme/palette";

const ResidentLayout = () => {
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  const screenBackground = resolvedTheme === "dark" ? PALETTE.slate[950] : PALETTE.white;

  return (
    <RoleLayout
      sidebarItems={residentNavItems}
      bottomNavItems={residentBottomNavItems}
      roleLabel="Resident"
    >
      <RouteGuard role="resident">
        <Stack
          screenOptions={{
            headerShown: false,
            ...screenTransition(reducedMotion),
            contentStyle: { backgroundColor: screenBackground },
          }}
        />
      </RouteGuard>
    </RoleLayout>
  );
};

export default ResidentLayout;
