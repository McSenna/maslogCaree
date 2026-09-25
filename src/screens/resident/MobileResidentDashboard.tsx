import { RefreshControl, ScrollView, View } from "react-native";
import StatCard from "@/components/resident/StatCard";
import AnnouncementsList from "@/features/resident/AnnouncementsList";
import RecentAppointments from "@/features/resident/RecentAppointments";
import UpcomingAppointment from "@/features/resident/UpcomingAppointment";
import { RESIDENT_COLORS } from "@/components/resident/residentTheme";
import type { ResidentDashboardModel } from "./useResidentDashboard";

type MobileResidentDashboardProps = {
  model: ResidentDashboardModel;
};

const MobileResidentDashboard = ({ model }: MobileResidentDashboardProps) => {

  return (
  <ScrollView
    className="flex-1 bg-white"
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 12, backgroundColor: "#FFFFFF" }}
    refreshControl={
      <RefreshControl
        refreshing={model.refreshing}
        onRefresh={model.refresh}
        tintColor={RESIDENT_COLORS.primary}
        colors={[RESIDENT_COLORS.primary]}
      />
    }
  >
    <View className="w-full gap-3.5">
      <View className="w-full gap-2.5">
        <View className="w-full flex-row gap-2.5">
          {model.stats.slice(0, 2).map((stat) => (
            <StatCard key={stat.id} stat={stat} compact />
          ))}
        </View>
        <View className="w-full flex-row gap-2.5">
          {model.stats.slice(2).map((stat) => (
            <StatCard key={stat.id} stat={stat} compact />
          ))}
        </View>
      </View>

      <UpcomingAppointment
        appointment={model.nextAppointment}
        onViewAll={model.handlers.onViewAllAppointments}
        onViewDetails={model.handlers.onViewAppointment}
        stacked
      />

      <RecentAppointments
        appointments={model.recentAppointments}
        onViewAll={model.handlers.onViewAllAppointments}
        onAppointmentPress={model.handlers.onViewAppointment}
        stacked
      />

      <AnnouncementsList
        announcements={model.announcements}
        onViewAll={model.handlers.onViewAllAnnouncements}
        onAnnouncementPress={model.handlers.onAnnouncement}
      />
    </View>
  </ScrollView>
  );
};

export default MobileResidentDashboard;
