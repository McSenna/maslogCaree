import type { ReactNode } from "react";
import { View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

/** Recovery support never mounts cached notifications or protected navigation. */
const ResidentRecoveryShell = ({ children }: { children: ReactNode }) => {
  const palette = useAdminSurfacePalette();
  const router = useRouter();
  const { logout } = useAuth();
  // The access notice has its own actions, so this bar is only for the way back from support.
  const onAccessNotice = usePathname() !== "/resident/support-requests";
  if (onAccessNotice) return <View className="flex-1" style={{ backgroundColor: palette.pageBg }}>{children}</View>;
  return (
    <View className="flex-1" style={{ backgroundColor: palette.pageBg }}>
      <View className="flex-row flex-wrap gap-3 p-4">
        <DashboardButton
          palette={palette}
          label="Return to access notice"
          onPress={() => router.replace("/resident/dashboard")}
        />
        <DashboardButton palette={palette} label="Sign out" onPress={logout} />
      </View>
      {children}
    </View>
  );
};
export default ResidentRecoveryShell;
