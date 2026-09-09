import { ScrollView, View } from "react-native";
import AnnouncementsList from "@/features/resident/AnnouncementsList";
import { useResidentDashboard } from "@/screens/resident/useResidentDashboard";

/**
 * Announcements.
 *
 * Reuses the dashboard's section and its data, so the list here and the preview
 * on the dashboard are the same resident-scoped rows.
 */
const ResidentAnnouncementsRoute = () => {
  const { announcements, handlers } = useResidentDashboard();

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="w-full">
        <AnnouncementsList
          announcements={announcements}
          onViewAll={handlers.onViewAllAnnouncements}
          onAnnouncementPress={handlers.onAnnouncement}
        />
      </View>
    </ScrollView>
  );
};

export default ResidentAnnouncementsRoute;
