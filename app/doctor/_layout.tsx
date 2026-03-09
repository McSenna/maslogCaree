import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import RoleLayout from "../../components/layout/RoleLayout";
import {
  doctorNavItems,
  doctorBottomNavItems,
} from "../../config/roleNavConfig";

export default function DoctorLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.role !== "doctor") {
    const { getDashboardPath } = require("../../data/mockUsers");
    return <Redirect href={getDashboardPath(user.role)} />;
  }

  return (
    <RoleLayout
      sidebarItems={doctorNavItems}
      bottomNavItems={doctorBottomNavItems}
      roleLabel="Doctor"
    >
      <Stack screenOptions={{ headerShown: false }} />
    </RoleLayout>
  );
}
