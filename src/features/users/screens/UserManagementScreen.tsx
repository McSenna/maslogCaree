import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { toast } from "@/components/feedback";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { getSidebarWidth } from "@/components/navigation/sidebar/sidebarTheme";
// The announcements CSV saver is format-agnostic: a file download on web, the share sheet on phones.
import { exportAnnouncementsCsv as saveCsv } from "@/features/announcements/admin/services/exportAnnouncementsCsv";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import PhoneUsersView from "../admin/components/phone/PhoneUsersView";
import ScreenOverlays from "../admin/components/shared/ScreenOverlays";
import { TABLE_MIN_WIDTH } from "../admin/components/wide/tableColumns";
import WideUsersView from "../admin/components/wide/WideUsersView";
import { useUsersScreen } from "../admin/hooks/useUsersScreen";
import { buildUsersCsv, usersCsvFileName } from "../admin/userCsv";
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

  // Exports the rows on screen, so the file matches the tab, search and filters.
  const onExport = () => {
    saveCsv(buildUsersCsv(screen.rows), usersCsvFileName()).catch(() =>
      toast.error("Could not export users.", "Try again in a moment.")
    );
  };

  const body = wide ? (
    <WideUsersView screen={screen} width={width} insets={insets} onExport={onExport} />
  ) : (
    <PhoneUsersView screen={screen} width={width} onExport={onExport} />
  );

  return (
    <View style={theme.vars} onLayout={handleLayout} className="w-full flex-1">
      <RoleScreenBackdrop color={theme.palette.page} insets={insets} />
      {body}
      <ScreenOverlays screen={screen} phone={!wide} />
    </View>
  );
};

export default UserManagementScreen;
