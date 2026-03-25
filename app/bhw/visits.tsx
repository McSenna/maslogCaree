import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";

export default function BhwVisits() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Community Visits</PageTitle>
          <PageSubtitle>
            Schedule and track home visits.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Mar 5, 2026 – Juan Dela Cruz"
            description="Zone 1 · Blood pressure check · Completed"
            icon={<Feather name="map-pin" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Mar 6, 2026 – Maria Lopez"
            description="Zone 2 · Prenatal follow-up · Scheduled"
            icon={<Feather name="map-pin" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Mar 7, 2026 – Pedro Santos"
            description="Zone 1 · Medication follow-up · Scheduled"
            icon={<Feather name="map-pin" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
