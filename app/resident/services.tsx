import { ScrollView, useWindowDimensions, View } from "react-native";
import HealthServices from "@/features/resident/HealthServices";
import { healthServices } from "@/data/residentDashboardData";
import { useResidentDashboard } from "@/screens/resident/useResidentDashboard";
import { BREAKPOINTS } from "@/constants/breakpoints";

/**
 * Health Services.
 *
 * Reuses the dashboard's services section rather than a second implementation,
 * so the cards a resident taps here look and behave exactly like the ones on
 * the dashboard.
 */
const ResidentServicesRoute = () => {
  const { width } = useWindowDimensions();
  const { handlers } = useResidentDashboard();

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="w-full">
        <HealthServices
          services={healthServices}
          onViewAll={handlers.onViewAllServices}
          onServicePress={handlers.onService}
          stacked={width < BREAKPOINTS.tablet}
        />
      </View>
    </ScrollView>
  );
};

export default ResidentServicesRoute;
