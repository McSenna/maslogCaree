import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import { useTheme } from "@/contexts/ThemeContext";
import { screenTransition, useReducedMotion } from "@/design/motion";
import {
  residentNavItems,
  residentBottomNavItems,
} from "@/config/roleNavConfig";

const ResidentLayout = () => {
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  const screenBackground = resolvedTheme === "dark" ? "#020617" : "#FFFFFF";

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
