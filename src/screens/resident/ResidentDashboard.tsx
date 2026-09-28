import { ScrollView, View } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import ErrorState from "@/components/feedback/ErrorState";
import { ResidentDashboardSkeleton } from "@/components/ui/Skeleton";
import { BREAKPOINTS } from "@/theme/breakpoints";
import DesktopResidentDashboard from "./DesktopResidentDashboard";
import MobileResidentDashboard from "./MobileResidentDashboard";
import { useResidentDashboard } from "./useResidentDashboard";
import { useResponsive } from "@/hooks/useResponsive";

// Resident screens are light-only (fixed RESIDENT_COLORS), so the backdrop uses the light dashboard page colour.
const palette = getAdminDashboardPalette("light");

const ResidentDashboard = () => {
  const { isMobile, width } = useResponsive();
  const insets = useRoleScreenInsets();
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

  const contentStyle = {
    paddingHorizontal: insets.gutter,
    paddingTop: insets.paddingTop,
    paddingBottom: insets.paddingBottom,
  };

  return (
    <View className="flex-1 w-full min-w-0">
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />
      {isMobile ? (
        <MobileResidentDashboard model={model} contentStyle={contentStyle} />
      ) : (
        <DesktopResidentDashboard
          model={model}
          compact={isTablet}
          contentStyle={contentStyle}
        />
      )}
    </View>
  );
};

export default ResidentDashboard;
