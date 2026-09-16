import { ScrollView, useWindowDimensions, View } from "react-native";
import HealthServices from "@/features/resident/HealthServices";
import { healthServices } from "@/data/residentDashboardData";
import { useResidentDashboard } from "@/screens/resident/useResidentDashboard";
import { BREAKPOINTS } from "@/constants/breakpoints";

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
