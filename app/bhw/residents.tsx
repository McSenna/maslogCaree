import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";

export default function BhwResidents() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Residents</PageTitle>
          <PageSubtitle>
            View assigned residents under your monitoring.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Juan Dela Cruz"
            description="Zone 1 · Last visit: Mar 1, 2026"
            icon={<Feather name="user" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Maria Lopez"
            description="Zone 2 · Prenatal monitoring"
            icon={<Feather name="user" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Pedro Santos"
            description="Zone 1 · Senior · Hypertension"
            icon={<Feather name="user" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
