import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function DoctorPrescriptions() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Prescriptions</PageTitle>
          <PageSubtitle>
            Manage and view prescription records.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Carlos Diaz"
            description="Losartan 50mg · Once daily · 90 days supply."
            icon={<Feather name="file-text" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Ricardo Santos"
            description="Metformin 500mg · Twice daily · 60 days supply."
            icon={<Feather name="file-text" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
