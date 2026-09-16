import type { ReactNode } from "react";
import { Platform, RefreshControl } from "react-native";

import type { UserManagementController } from "../hooks/useUserManagementScreen";
import MobileLayoutEmpty from "./mobileLayout/MobileLayoutEmpty";
import MobileLayoutFooter from "./mobileLayout/MobileLayoutFooter";
import MobileLayoutHeader from "./mobileLayout/MobileLayoutHeader";
import NativeListLayout from "./mobileLayout/NativeListLayout";
import WebScrollLayout from "./mobileLayout/WebScrollLayout";
import { useUsersPalette } from "./usersTheme";

type UsersMobileLayoutProps = {
  controller: UserManagementController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

const UsersMobileLayout = ({
  controller,
  toolbar,
  emptyState,
}: UsersMobileLayoutProps) => {
  const palette = useUsersPalette();
  const { isRequestsSection, requests } = controller;

  const refreshControl = (
    <RefreshControl
      refreshing={isRequestsSection ? requests.refreshing : controller.refreshing}
      onRefresh={isRequestsSection ? requests.refreshRequests : controller.refreshUsers}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );

  const header = <MobileLayoutHeader controller={controller} toolbar={toolbar} />;
  const footer = <MobileLayoutFooter controller={controller} />;
  const empty = <MobileLayoutEmpty controller={controller} emptyState={emptyState} />;
  const contentStyle = { ...controller.contentPadding, flexGrow: 1 };

  if (Platform.OS === "web") {
    return (
      <WebScrollLayout
        controller={controller}
        header={header}
        empty={empty}
        footer={footer}
        refreshControl={refreshControl}
        contentStyle={contentStyle}
      />
    );
  }

  return (
    <NativeListLayout
      controller={controller}
      header={header}
      empty={empty}
      footer={footer}
      refreshControl={refreshControl}
      contentStyle={contentStyle}
    />
  );
};

export default UsersMobileLayout;
