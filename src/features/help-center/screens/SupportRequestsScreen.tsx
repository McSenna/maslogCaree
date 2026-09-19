import { ScrollView, Text, View } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import SupportRequestsContent from "../content/SupportRequestsContent";
import HelpSupportOverlays from "../overlays/HelpSupportOverlays";
import { useHelpSupportOverlay } from "../hooks/useHelpSupportOverlay";

const PAGE_MAX_WIDTH = 880;

const SupportRequestsScreen = () => {
  const palette = useAdminSurfacePalette();
  const insets = useRoleScreenInsets();
  const overlay = useHelpSupportOverlay();

  return (
    <View style={{ flex: 1, backgroundColor: palette.pageBg }}>
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
          maxWidth: PAGE_MAX_WIDTH,
          alignSelf: "center",
          gap: 16,
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom + 32,
        }}
      >
        <Text
          accessibilityRole="header"
          style={{ fontSize: 20, fontWeight: "700", color: palette.heading }}
        >
          My Support Requests
        </Text>

        <SupportRequestsContent
          activeTicketId={null}
          onOpenTicket={overlay.openTicketDetails}
          onBackToList={overlay.backToList}
          onContactSupport={overlay.openContactSupport}
        />
      </ScrollView>

      <HelpSupportOverlays overlay={overlay} />
    </View>
  );
};

export default SupportRequestsScreen;
