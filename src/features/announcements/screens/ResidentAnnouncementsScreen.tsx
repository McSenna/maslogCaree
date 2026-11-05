import { RefreshControl, ScrollView, Text, View } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { usePageMaxWidth } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import AnnouncementFeedList from "../components/feed/AnnouncementFeedList";
import { useAnnouncementFeed } from "../hooks/useAnnouncementFeed";
import { fetchAnnouncements } from "../services/announcementService";

/** Same frame as the admin feed: page surface, role gutters, and the centred `feed` width on large screens. */
const ResidentAnnouncementsScreen = () => {
  const maxWidth = usePageMaxWidth("feed");
  const palette = useAdminSurfacePalette();
  const insets = useRoleScreenInsets();
  const feed = useAnnouncementFeed(fetchAnnouncements);

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
          paddingBottom: insets.paddingBottom + 32,
        }}
      >
        <View style={{ width: "100%", maxWidth, alignSelf: "center", gap: 20 }}>
          <Text role="heading" aria-level={1} className="sr-only">Announcements</Text>

          <AnnouncementFeedList
            feed={feed}
            emptyTitle="No announcements yet"
            emptyDescription="When the health center posts news or an upcoming activity, it will show up here and in your notifications."
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ResidentAnnouncementsScreen;
