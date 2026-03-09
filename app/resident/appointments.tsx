import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function ResidentAppointments() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Appointments</PageTitle>
          <PageSubtitle>
            View and manage your healthcare appointments.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="General Checkup – March 20, 2026"
            description="Dr. Maria Santos · 10:30 AM · Confirmed"
            icon={<Feather name="calendar" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="February 10, 2026 – Consultation"
            description="Completed · Dr. Maria Santos · Mild flu"
            icon={<Feather name="check-circle" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="January 5, 2026 – Vaccination"
            description="Completed · Influenza vaccine"
            icon={<Feather name="shield" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
