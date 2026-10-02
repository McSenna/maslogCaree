import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { getSidebarWidth } from "@/components/navigation/sidebar/sidebarTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useSearchParamValue } from "@/hooks/useSearchParamValue";

import PhoneAnnouncementsView from "../admin/components/phone/PhoneAnnouncementsView";
import { TABLE_MIN_WIDTH } from "../admin/components/wide/tableColumns";
import WideAnnouncementsView from "../admin/components/wide/WideAnnouncementsView";
import { useAnnouncementsScreen } from "../admin/hooks/useAnnouncementsScreen";
import { useExportCsv } from "../admin/hooks/useExportCsv";
import { useAnnouncementTheme } from "../admin/useAnnouncementTheme";
import AnnouncementEditorDialog from "../components/create/AnnouncementEditorDialog";

// The role shell's content padding on either side of the page from tablet width up.
const SHELL_PADDING_X = 48;

/**
 * Admin announcements. The table needs the width beside the app sidebar, not
 * the window, so the page measures itself: below the table's minimum it shows
 * the phone list, which also covers tablets in portrait.
 */
const AdminAnnouncementsScreen = () => {
  const theme = useAnnouncementTheme();
  const insets = useRoleScreenInsets();
  const { isMobile, width: windowWidth, breakpoint } = useResponsive();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  // `?compose=1` is the dashboard's "New announcement" shortcut.
  const screen = useAnnouncementsScreen(useSearchParamValue("compose") === "1");
  const exportCsv = useExportCsv(screen.visible);

  // Until the first layout, estimate the content width from the window.
  const width = measuredWidth ?? windowWidth - getSidebarWidth(breakpoint) - SHELL_PADDING_X;
  const wide = !isMobile && width - insets.gutter * 2 >= TABLE_MIN_WIDTH;

  const handleLayout = (event: LayoutChangeEvent) => setMeasuredWidth(event.nativeEvent.layout.width);
  const onExport = () => void exportCsv();

  const body = wide ? (
    <WideAnnouncementsView screen={screen} width={width} insets={insets} onExport={onExport} />
  ) : (
    <PhoneAnnouncementsView screen={screen} onExport={onExport} />
  );

  return (
    <View style={theme.vars} onLayout={handleLayout} className="w-full flex-1">
      <RoleScreenBackdrop color={theme.palette.page} insets={insets} />
      {body}
      {screen.editor ? (
        <AnnouncementEditorDialog
          key={screen.editor === "new" ? "new" : screen.editor.id}
          editing={screen.editor === "new" ? null : screen.editor}
          onClose={screen.closeEditor}
          onSaved={screen.data.upsert}
        />
      ) : null}
    </View>
  );
};

export default AdminAnnouncementsScreen;
