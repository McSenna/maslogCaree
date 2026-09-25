import { ScrollView, View } from "react-native";
import ErrorState from "@/components/feedback/ErrorState";
import { ResidentDashboardSkeleton } from "@/components/ui/Skeleton";
import { BREAKPOINTS } from "@/theme/breakpoints";
import DesktopResidentDashboard from "./DesktopResidentDashboard";
import MobileResidentDashboard from "./MobileResidentDashboard";
import { useResidentDashboard } from "./useResidentDashboard";
import { useResponsive } from "@/hooks/useResponsive";

const ResidentDashboard = () => {
  const { isMobile, width } = useResponsive();
  const model = useResidentDashboard();

  const isTablet = !isMobile && width < BREAKPOINTS.xl;
  const nothingLoaded = !model.nextAppointment && model.stats.every((stat) => stat.value === 0);

  if (model.loading) {
    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} accessibilityLabel="Loading your dashboard">
        <ResidentDashboardSkeleton />
      </ScrollView>
    );
  }

  if (model.error && nothingLoaded) {
    return <ErrorState title="Unable to load your dashboard" message={model.error} onRetry={model.reload} />;
  }

  return (
    <View className="flex-1 w-full min-w-0">
      {isMobile ? (
        <MobileResidentDashboard model={model} />
      ) : (
        <DesktopResidentDashboard model={model} compact={isTablet} />
      )}
    </View>
  );
};

export default ResidentDashboard;
