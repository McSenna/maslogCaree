import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import StatCard from "@/components/resident/StatCard";
import WelcomeBanner from "@/components/resident/WelcomeBanner";
import AnnouncementsList from "@/features/resident/AnnouncementsList";
import HealthServices from "@/features/resident/HealthServices";
import HealthTips from "@/features/resident/HealthTips";
import QuickActions from "@/features/resident/QuickActions";
import RecentAppointments from "@/features/resident/RecentAppointments";
import UpcomingAppointment from "@/features/resident/UpcomingAppointment";
import { RESIDENT_COLORS } from "@/components/resident/residentTheme";
import type { ResidentDashboardModel } from "./useResidentDashboard";

type DesktopResidentDashboardProps = {
  model: ResidentDashboardModel;
  /** Tablet widths keep the two-column grid but tighten the gaps. */
  compact?: boolean;
};

/**
 * The desktop Resident Dashboard.
 *
 * Follows the target's structure exactly: greeting and quote banner, then the
 * four statistics across one row, then three two-column rows pairing an
 * appointment/history/announcements column on the left with actions/tips/
 * services on the right.
 */
const DesktopResidentDashboard = ({ model, compact = false }: DesktopResidentDashboardProps) => {
  const gap = compact ? "gap-3" : "gap-4";

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
      contentContainerStyle={{ paddingBottom: 24, backgroundColor: "#FFFFFF" }}
      refreshControl={
        <RefreshControl
          refreshing={model.refreshing}
          onRefresh={model.refresh}
          tintColor={RESIDENT_COLORS.primary}
          colors={[RESIDENT_COLORS.primary]}
        />
      }
    >
      <View className={`w-full ${gap}`}>
        <WelcomeBanner greeting={model.greeting} firstName={model.firstName} />

        {/* Four statistics across one row */}
        <View className={`w-full flex-row ${gap}`}>
          {model.stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </View>

        {/* Row 1 — appointment | quick actions */}
        <View className={`w-full flex-row items-start ${gap}`}>
          <View className="min-w-0 flex-1">
            <UpcomingAppointment
              appointment={model.nextAppointment}
              onViewAll={model.handlers.onViewAllAppointments}
              onViewDetails={model.handlers.onViewAppointment}
            />
          </View>
          <View className="min-w-0 flex-1">
            <QuickActions
              actions={model.quickActions}
              onActionPress={model.handlers.onQuickAction}
              onViewAll={model.handlers.onViewAllQuickActions}
            />
          </View>
        </View>

        {/* Row 2 — history | health tips */}
        <View className={`w-full flex-row items-start ${gap}`}>
          <View className="min-w-0 flex-1">
            <RecentAppointments
              appointments={model.recentAppointments}
              onViewAll={model.handlers.onViewAllAppointments}
              onAppointmentPress={model.handlers.onViewAppointment}
            />
          </View>
          <View className="min-w-0 flex-1">
            <HealthTips
              tip={model.healthTip}
              onSeeMore={model.handlers.onHealthTipsSeeMore}
              onLearnMore={model.handlers.onLearnMore}
            />
          </View>
        </View>

        {/* Row 3 — announcements | services */}
        <View className={`w-full flex-row items-start ${gap}`}>
          <View className="min-w-0 flex-1">
            <AnnouncementsList
              announcements={model.announcements}
              onViewAll={model.handlers.onViewAllAnnouncements}
              onAnnouncementPress={model.handlers.onAnnouncement}
            />
          </View>
          <View className="min-w-0 flex-1">
            <HealthServices
              services={model.healthServices}
              onViewAll={model.handlers.onViewAllServices}
              onServicePress={model.handlers.onService}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DesktopResidentDashboard;
