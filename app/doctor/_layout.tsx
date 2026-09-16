import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import { screenTransition, useReducedMotion } from "@/design/motion";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  doctorNavItems,
  doctorBottomNavItems,
} from "@/config/roleNavConfig";

const DoctorLayout = () => {
  const reducedMotion = useReducedMotion();
  return (
    <RoleLayout
      sidebarItems={doctorNavItems}
      bottomNavItems={doctorBottomNavItems}
      roleLabel="Doctor"
    >
      <RouteGuard role="doctor">
        <Stack screenOptions={{ headerShown: false, ...screenTransition(reducedMotion) }} />
      </RouteGuard>
    </RoleLayout>
  );
}

export default DoctorLayout;
