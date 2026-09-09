import { Stack } from "expo-router";
import RoleLayout from "@/components/layout/RoleLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import {
  doctorNavItems,
  doctorBottomNavItems,
} from "@/config/roleNavConfig";

const DoctorLayout = () => {
  return (
    <RouteGuard role="doctor">
      <RoleLayout
        sidebarItems={doctorNavItems}
        bottomNavItems={doctorBottomNavItems}
        roleLabel="Doctor"
      >
        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      </RoleLayout>
    </RouteGuard>
  );
}

export default DoctorLayout;
