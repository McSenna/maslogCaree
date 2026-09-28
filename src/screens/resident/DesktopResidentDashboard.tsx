import { RefreshControl, ScrollView, View, type ViewStyle } from "react-native";
import StatCard from "@/components/resident/StatCard";
import AnnouncementsList from "@/features/resident/AnnouncementsList";
import HealthTips from "@/features/resident/HealthTips";
import RecentAppointments from "@/features/resident/RecentAppointments";
import UpcomingAppointment from "@/features/resident/UpcomingAppointment";
import { RESIDENT_COLORS } from "@/components/resident/residentTheme";
import type { ResidentDashboardModel } from "./useResidentDashboard";

type DesktopResidentDashboardProps = {
  model: ResidentDashboardModel;
  compact?: boolean;
  contentStyle: ViewStyle;
};

const DesktopResidentDashboard = ({
  model,
  compact = false,
  contentStyle,
}: DesktopResidentDashboardProps) => {
  const gap = compact ? "gap-3" : "gap-4";

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentStyle}
      refreshControl={
        <RefreshControl
          refreshing={model.refreshing}
          onRefresh={model.refresh}
          tintColor={RESIDENT_COLORS.primary}
          colors={[RESIDENT_COLORS.primary]}
        />
      }
    >
      <View className={`w-full ${compact ? "gap-4" : "gap-5"}`}>
        <View className={`w-full flex-row ${gap}`}>
          {model.stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </View>

        <View className={`w-full flex-row items-stretch ${gap}`}>
          <View className="min-w-0 flex-1">
            <UpcomingAppointment
              fill
              appointment={model.nextAppointment}
              onViewAll={model.handlers.onViewAllAppointments}
              onViewDetails={model.handlers.onViewAppointment}
            />
          </View>
          <View className="min-w-0 flex-1">
            <HealthTips
              fill
              tip={model.healthTip}
              onSeeMore={model.handlers.onHealthTipsSeeMore}
              onLearnMore={model.handlers.onLearnMore}
            />
          </View>
        </View>

        <View className={`w-full flex-row items-stretch ${gap}`}>
          <View className="min-w-0 flex-1">
            <RecentAppointments
              fill
              appointments={model.recentAppointments}
              onViewAll={model.handlers.onViewAllAppointments}
              onAppointmentPress={model.handlers.onViewAppointment}
            />
          </View>
          <View className="min-w-0 flex-1">
            <AnnouncementsList
              fill
              announcements={model.announcements}
              onViewAll={model.handlers.onViewAllAnnouncements}
              onAnnouncementPress={model.handlers.onAnnouncement}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DesktopResidentDashboard;
