import { ScrollView, View } from "react-native";
import HealthServices from "@/features/resident/HealthServices";
import { healthServices } from "@/data/residentDashboardData";
import { useResidentDashboard } from "@/screens/resident/useResidentDashboard";
import { useResponsive } from "@/hooks/useResponsive";

const ResidentServicesRoute = () => {
  const { isMobile } = useResponsive();
  const { handlers } = useResidentDashboard();

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="w-full">
        <HealthServices
          services={healthServices}
          onViewAll={handlers.onViewAllServices}
          onServicePress={handlers.onService}
          stacked={isMobile}
        />
      </View>
    </ScrollView>
  );
};

export default ResidentServicesRoute;
