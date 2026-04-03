import { Redirect, Stack, type Href } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import RoleLayout from "@/components/layout/RoleLayout";
import { getDashboardPath } from "@/data/mockUsers";
import {
  doctorNavItems,
  doctorBottomNavItems,
} from "@/config/roleNavConfig";

const DoctorLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "doctor") {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return (
    <RoleLayout
      sidebarItems={doctorNavItems}
      bottomNavItems={doctorBottomNavItems}
      roleLabel="MaslogCare"
    >
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </RoleLayout>
  );
}

export default DoctorLayout;
