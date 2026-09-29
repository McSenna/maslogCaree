import { ScrollView, View } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { usePageMaxWidth, useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import HelpCenterContent from "../content/HelpCenterContent";
import HelpSupportOverlays from "../overlays/HelpSupportOverlays";
import { useHelpCenterScreen } from "../hooks/useHelpCenterScreen";

const HelpCenterScreen = () => {
  const palette = useAdminSurfacePalette();
  const insets = useRoleScreenInsets();
  const maxWidth = usePageMaxWidth("content");
  const { isWideDesktop } = useResponsive();
  const { overlay, expandedCategoryId } = useHelpCenterScreen();

  return (
    <View style={{ flex: 1, backgroundColor: palette.pageBg }}>
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
          maxWidth,
          alignSelf: "center",
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom + 32,
        }}
      >
        <HelpCenterContent
          expandedCategoryId={expandedCategoryId}
          onContactSupport={overlay.openContactSupport}
          onViewRequests={overlay.openSupportRequests}
          sideRail={isWideDesktop}
        />
      </ScrollView>

      <HelpSupportOverlays overlay={overlay} />
    </View>
  );
};

export default HelpCenterScreen;
