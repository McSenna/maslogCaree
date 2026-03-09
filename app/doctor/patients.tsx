import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function DoctorPatients() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Patients</PageTitle>
          <PageSubtitle>
            View and manage your patient list.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Juan Dela Cruz"
            description="Last visit: Mar 1, 2026 · Hypertension"
            icon={<Feather name="user" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Maria Lopez"
            description="Last visit: Mar 3, 2026 · Prenatal care"
            icon={<Feather name="user" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Ana Reyes"
            description="Last visit: Feb 28, 2026 · General checkup"
            icon={<Feather name="user" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
