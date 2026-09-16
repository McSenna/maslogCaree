import { View } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import UsersDesktopLayout from "../components/UsersDesktopLayout";
import UsersEmptyState from "../components/UsersEmptyState";
import UsersMobileLayout from "../components/UsersMobileLayout";
import UsersOverlays from "../components/UsersOverlays";
import UsersToolbar from "../components/UsersToolbar";
import { useUsersPalette } from "../components/usersTheme";
import { useUserManagementScreen } from "../hooks/useUserManagementScreen";

const UserManagementScreen = () => {
  const palette = useUsersPalette();
  const controller = useUserManagementScreen();

  const toolbar = <UsersToolbar controller={controller} />;
  const emptyState = (
    <UsersEmptyState
      error={controller.error}
      hasActiveFilters={controller.filters.hasActiveFilters}
      onRetry={controller.fetchUsers}
    />
  );

  return (
    <View className="flex-1" onLayout={controller.measureContent}>
      <RoleScreenBackdrop color={palette.pageBg} insets={controller.insets} />

      {controller.showTable ? (
        <UsersDesktopLayout controller={controller} toolbar={toolbar} emptyState={emptyState} />
      ) : (
        <UsersMobileLayout controller={controller} toolbar={toolbar} emptyState={emptyState} />
      )}

      <UsersOverlays controller={controller} />
    </View>
  );
};

export default UserManagementScreen;
