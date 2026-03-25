import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";

export default function DoctorConsultations() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Consultations</PageTitle>
          <PageSubtitle>
            View consultation history and notes.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Carlos Diaz – Mar 5, 2026"
            description="Hypertension follow-up · BP stable · Medication continued."
            icon={<Feather name="message-circle" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Liza Ramos – Mar 4, 2026"
            description="Post-natal checkup · Mother and baby in good health."
            icon={<Feather name="message-circle" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
