import { View } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import UsersDesktopLayout from "../components/UsersDesktopLayout";
import UsersEmptyState from "../components/UsersEmptyState";
import UsersMobileLayout from "../components/UsersMobileLayout";
import UsersOverlays from "../components/UsersOverlays";
import UsersToolbar from "../components/UsersToolbar";
import { useUsersPalette } from "../components/usersTheme";
import { useUserManagementScreen } from "../hooks/useUserManagementScreen";

/**
 * User Management.
 *
 * Every account in the barangay system, with the admin's two powers over them:
 * seeing the full record, and suspending or reactivating access. Accounts are
 * created through public registration, not here.
 *
 * The table and card layouts are chosen by measured content width rather than
 * window width — the admin sidebar owns a fixed slice of the viewport, so the
 * window alone would put the table into a layout the page has no room for.
 */
export default function UserManagementScreen() {
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
}
