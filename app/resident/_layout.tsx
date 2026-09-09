import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import { useTheme } from "@/contexts/ThemeContext";
import {
  residentNavItems,
  residentBottomNavItems,
} from "@/config/roleNavConfig";

const ResidentLayout = () => {
  const { resolvedTheme } = useTheme();

  /**
   * The nested navigator paints its own screen container, and without an
   * explicit colour it falls back to React Navigation's default theme
   * background — `rgb(242,242,242)`, a light grey. That container sits *inside*
   * RoleLayout's white shell and *behind* the routed screen, which is why the
   * grey showed through around and between the dashboard's cards even though
   * every surface the app itself paints is already white.
   *
   * The root navigator in `app/_layout.tsx` sets this; this one had not, so it
   * reintroduced the default underneath. Derived from the theme rather than
   * hard-coded so the dark theme keeps working.
   */
  const screenBackground = resolvedTheme === "dark" ? "#020617" : "#FFFFFF";

  return (
    <RouteGuard role="resident">
      <RoleLayout
        sidebarItems={residentNavItems}
        bottomNavItems={residentBottomNavItems}
        roleLabel="Resident"
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: { backgroundColor: screenBackground },
          }}
        />
      </RoleLayout>
    </RouteGuard>
  );
};

export default ResidentLayout;
