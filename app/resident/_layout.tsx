import { useSyncExternalStore, type ReactNode } from "react";
import ResidentSessionGate from "@/features/webAccess/ResidentSessionGate";
import ResidentRecoveryShell from "@/features/webAccess/ResidentRecoveryShell";
import {
  isResidentWebBlocked,
  subscribeResidentWebBlock,
} from "@/services/residentWebBlock";
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

const residentScreenLayout = ({ children }: { children: ReactNode }) => (
  <ResidentSessionGate>{children}</ResidentSessionGate>
);

const ResidentLayout = () => {
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const blocked = useSyncExternalStore(
    subscribeResidentWebBlock,
    isResidentWebBlocked,
    () => false,
  );

  const screenBackground =
    resolvedTheme === "dark" ? PALETTE.slate[950] : PALETTE.white;

  const screens = (
    <Stack
      screenLayout={residentScreenLayout}
      screenOptions={{
        headerShown: false,
        ...screenTransition(reducedMotion),
        contentStyle: { backgroundColor: screenBackground },
      }}
    />
  );
  return (
    <RouteGuard role="resident">
      {blocked ? (
        <ResidentRecoveryShell>{screens}</ResidentRecoveryShell>
      ) : (
        <RoleLayout
          sidebarItems={residentNavItems}
          bottomNavItems={residentBottomNavItems}
          roleLabel="Resident"
        >
          {screens}
        </RoleLayout>
      )}
    </RouteGuard>
  );
};

export default ResidentLayout;
