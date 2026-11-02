import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { getSidebarWidth } from "@/components/navigation/sidebar/sidebarTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { WebAccessPermissionProvider } from "@/features/webAccess/webAccessPermission";

import PhoneUsersView from "../admin/components/phone/PhoneUsersView";
import ScreenOverlays from "../admin/components/shared/ScreenOverlays";
import { TABLE_MIN_WIDTH } from "../admin/components/wide/tableColumns";
import WideUsersView from "../admin/components/wide/WideUsersView";
import { useUsersScreen } from "../admin/hooks/useUsersScreen";
import { useUsersTheme } from "../admin/useUsersTheme";

// The role shell's content padding on either side of the page from tablet width up.
const SHELL_PADDING_X = 48;

/**
 * Admin Users. The table needs the width beside the app sidebar, not the
 * window, so the page measures itself: below the table's minimum it shows the
 * phone list, which also covers tablets in portrait.
 */
const UserManagementScreen = () => {
  const theme = useUsersTheme();
  const insets = useRoleScreenInsets();
  const { isMobile, width: windowWidth, breakpoint } = useResponsive();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const screen = useUsersScreen({ isPhone: isMobile });

  // Until the first layout, estimate the content width from the window.
  const width = measuredWidth ?? windowWidth - getSidebarWidth(breakpoint) - SHELL_PADDING_X;
  const wide = !isMobile && width - insets.gutter * 2 >= TABLE_MIN_WIDTH;

  const handleLayout = (event: LayoutChangeEvent) => setMeasuredWidth(event.nativeEvent.layout.width);

  return (
    <WebAccessPermissionProvider>
      <View style={theme.vars} onLayout={handleLayout} className="w-full flex-1">
        <RoleScreenBackdrop color={theme.palette.page} insets={insets} />
        {wide ? <WideUsersView screen={screen} width={width} insets={insets} /> : <PhoneUsersView screen={screen} width={width} />}
        <ScreenOverlays screen={screen} phone={!wide} />
      </View>
    </WebAccessPermissionProvider>
  );
};

export default UserManagementScreen;
