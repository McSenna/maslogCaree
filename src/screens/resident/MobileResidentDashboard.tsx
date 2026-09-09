import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import StatCard from "@/components/resident/StatCard";
import WelcomeBanner from "@/components/resident/WelcomeBanner";
import AnnouncementsList from "@/features/resident/AnnouncementsList";
import HealthServices from "@/features/resident/HealthServices";
import QuickActions from "@/features/resident/QuickActions";
import RecentAppointments from "@/features/resident/RecentAppointments";
import UpcomingAppointment from "@/features/resident/UpcomingAppointment";
import { RESIDENT_COLORS } from "@/components/resident/residentTheme";
import type { ResidentDashboardModel } from "./useResidentDashboard";

type MobileResidentDashboardProps = {
  model: ResidentDashboardModel;
};

const MobileResidentDashboard = ({ model }: MobileResidentDashboardProps) => {
  // The first load shows a spinner rather than zeros, so a resident never sees
  // a figure that is about to change under them.
  if (model.loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={RESIDENT_COLORS.primary} />
      </View>
    );
  }

  if (model.error && !model.nextAppointment && model.stats.every((s) => s.value === 0)) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-white px-8">
        <Text className="text-center text-[15px] font-semibold" style={{ color: RESIDENT_COLORS.heading }}>
          Unable to load your dashboard
        </Text>
        <Text className="text-center text-[13px]" style={{ color: RESIDENT_COLORS.muted }}>
          {model.error}
        </Text>
        <Pressable
          onPress={model.reload}
          accessibilityRole="button"
          accessibilityLabel="Retry loading the dashboard"
          className="items-center justify-center px-6 active:opacity-85"
          style={{ height: 44, borderRadius: 10, backgroundColor: RESIDENT_COLORS.primary }}
        >
          <Text className="text-[14px] font-semibold text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

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
      <WelcomeBanner greeting={model.greeting} firstName={model.firstName} stacked />

      {/* Statistics — 2x2 */}
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

      <QuickActions
        actions={model.quickActions}
        onActionPress={model.handlers.onQuickAction}
        onViewAll={model.handlers.onViewAllQuickActions}
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

      <HealthServices
        services={model.healthServices}
        onViewAll={model.handlers.onViewAllServices}
        onServicePress={model.handlers.onService}
        stacked
      />

    </View>
  </ScrollView>
  );
};

export default MobileResidentDashboard;
