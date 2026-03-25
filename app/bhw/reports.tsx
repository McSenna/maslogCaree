import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";

export default function BhwReports() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Reports</PageTitle>
          <PageSubtitle>
            View your activity and visit reports.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Monthly Visit Summary"
            description="View completed visits and pending follow-ups for this month."
            icon={<Feather name="bar-chart-2" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Vaccination Coverage"
            description="Track vaccination status of assigned residents."
            icon={<Feather name="shield" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
