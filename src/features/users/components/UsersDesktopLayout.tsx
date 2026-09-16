import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import type { UserManagementController } from "../hooks/useUserManagementScreen";
import UserRequestsTableCard from "./requests/UserRequestsTableCard";
import UserMetricCards from "./UserMetricCards";
import UserSectionTabs from "./UserSectionTabs";
import UsersTableCard from "./UsersTableCard";
import { useUsersPalette } from "./usersTheme";

type UsersDesktopLayoutProps = {
  controller: UserManagementController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

const UsersDesktopLayout = ({
  controller,
  toolbar,
  emptyState,
}: UsersDesktopLayoutProps) => {
  const palette = useUsersPalette();
  const { isRequestsSection, requests } = controller;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={controller.contentPadding}
      refreshControl={
        <RefreshControl
          refreshing={isRequestsSection ? requests.refreshing : controller.refreshing}
          onRefresh={isRequestsSection ? requests.refreshRequests : controller.refreshUsers}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
    >
      <View className="w-full gap-5">
        <UserMetricCards metrics={controller.metrics} isWide={controller.fourMetrics} />

        <UserSectionTabs
          section={controller.section}
          onSectionChange={controller.setSection}
          counts={controller.sectionCounts}
          isDesktop
        />

        {isRequestsSection ? (
          <UserRequestsTableCard
            requests={requests}
            showStatusFilter={controller.section === "requests"}
            tableAreaWidth={controller.tableAreaWidth}
            onTableAreaWidth={controller.setTableAreaWidth}
          />
        ) : (
          <UsersTableCard controller={controller} toolbar={toolbar} emptyState={emptyState} />
        )}
      </View>
    </ScrollView>
  );
};

export default UsersDesktopLayout;
