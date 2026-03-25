import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";

export default function ResidentRecords() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Medical Records</PageTitle>
          <PageSubtitle>
            View your health history and medical records.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Consultation – Feb 10, 2026"
            description="Diagnosis: Mild flu · Prescribed rest and fluids."
            icon={<Feather name="file-text" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Vaccination – Jan 5, 2026"
            description="Influenza vaccine · Recorded in barangay health log."
            icon={<Feather name="shield" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="General Checkup – Nov 2025"
            description="Routine checkup · Vital signs normal."
            icon={<Feather name="activity" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
