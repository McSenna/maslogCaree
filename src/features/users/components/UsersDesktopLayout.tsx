import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import type { UserManagementController } from "../hooks/useUserManagementScreen";
import UserMetricCards from "./UserMetricCards";
import UsersTableCard from "./UsersTableCard";
import { useUsersPalette } from "./usersTheme";

type UsersDesktopLayoutProps = {
  controller: UserManagementController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

/** Tablet and desktop: metric cards above one table card. */
export default function UsersDesktopLayout({
  controller,
  toolbar,
  emptyState,
}: UsersDesktopLayoutProps) {
  const palette = useUsersPalette();

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={controller.contentPadding}
      refreshControl={
        <RefreshControl
          refreshing={controller.refreshing}
          onRefresh={controller.refreshUsers}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
    >
      <View className="w-full gap-5">
        <UserMetricCards metrics={controller.metrics} isWide={controller.fourMetrics} />
        <UsersTableCard controller={controller} toolbar={toolbar} emptyState={emptyState} />
      </View>
    </ScrollView>
  );
}
