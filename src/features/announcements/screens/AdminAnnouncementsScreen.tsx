import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { usePageMaxWidth } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useSearchParamValue } from "@/hooks/useSearchParamValue";

import CreateAnnouncementDialog from "../components/create/CreateAnnouncementDialog";
import AnnouncementFeedList from "../components/feed/AnnouncementFeedList";
import { useAnnouncementFeed } from "../hooks/useAnnouncementFeed";
import { fetchAdminAnnouncements } from "../services/announcementService";

const AdminAnnouncementsScreen = () => {
  const maxWidth = usePageMaxWidth("feed");
  const palette = useAdminSurfacePalette();
  const insets = useRoleScreenInsets();
  const feed = useAnnouncementFeed(fetchAdminAnnouncements);
  // `?compose=1` is the dashboard's "New announcement" shortcut.
  const [creating, setCreating] = useState(useSearchParamValue("compose") === "1");

  const openCreate = () => setCreating(true);

  return (
    <View style={{ flex: 1, width: "100%", backgroundColor: palette.pageBg }}>
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={feed.refreshing}
            onRefresh={() => void feed.refresh()}
            tintColor={palette.primary}
            colors={[palette.primary]}
          />
        }
        contentContainerStyle={{
          width: "100%",
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom + 40,
        }}
      >
        <View style={{ width: "100%", maxWidth, alignSelf: "center", gap: 20 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end", gap: 16 }}>
            <View style={{ flex: 1, minWidth: 240, gap: 4 }}>
              <Text
                accessibilityRole="header"
                style={{ fontSize: 22, fontWeight: "700", letterSpacing: -0.2, color: palette.heading }}
              >
                Announcements
              </Text>
              <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.muted }}>
                Tell every resident and staff member what is happening, when, and where. Posts
                arrive in their MaslogCare notifications.
              </Text>
            </View>

            <Button
              label="New announcement"
              icon="plus"
              onPress={openCreate}
              accessibilityHint="Opens the form to write and post an announcement"
            />
          </View>

          <AnnouncementFeedList
            feed={feed}
            showAdminMeta
            emptyTitle="No announcements yet"
            emptyDescription="Post the first one to let everyone know about an upcoming event, schedule change, or health drive."
            emptyAction={{ label: "New announcement", onPress: openCreate }}
          />
        </View>
      </ScrollView>

      <CreateAnnouncementDialog
        visible={creating}
        onClose={() => setCreating(false)}
        onCreated={feed.prepend}
      />
    </View>
  );
};

export default AdminAnnouncementsScreen;
