import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import StatCard from "../../components/ui/StatCard";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

const todaysSchedule = [
  { time: "10:00 AM", patient: "Juan Dela Cruz", purpose: "Follow‑up consultation" },
  { time: "11:30 AM", patient: "Maria Lopez", purpose: "Prenatal checkup" },
  { time: "2:00 PM", patient: "Ana Reyes", purpose: "General checkup" },
];

export default function DoctorDashboard() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Doctor Dashboard</PageTitle>
          <PageSubtitle>
            View today&apos;s schedule, patient list, and completed consultations.
          </PageSubtitle>
        </View>

        <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
          <StatCard
            label="Appointments Today"
            value={todaysSchedule.length}
            helperText="Confirmed consultations for today"
            tone="primary"
            icon={<Feather name="calendar" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Completed Consultations"
            value={5}
            helperText="Earlier today at the health center"
            icon={<Feather name="check-circle" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Pending Follow-ups"
            value={3}
            helperText="Patients needing additional review"
            icon={<Feather name="file-text" size={22} color="#2D5BFF" />}
          />
        </View>

        <View className="gap-5 md:grid md:grid-cols-2 md:gap-6">
          <View className="gap-3">
            <PageTitle className="text-lg md:text-xl">Today&apos;s Schedule</PageTitle>
            {todaysSchedule.map((item) => (
              <InfoCard
                key={item.time}
                title={`${item.time} – ${item.patient}`}
                description={item.purpose}
                icon={<Feather name="user" size={18} color="#2D5BFF" />}
              />
            ))}
          </View>

          <View className="gap-3">
            <PageTitle className="text-lg md:text-xl">Recent Patients</PageTitle>
            <InfoCard
              title="Carlos Diaz"
              description="Consultation completed · Hypertension management · Next follow‑up in 3 months."
            />
            <InfoCard
              title="Liza Ramos"
              description="Post‑natal checkup · Mother and baby are stable."
            />
            <InfoCard
              title="Ricardo Santos"
              description="Diabetes monitoring · New medication plan reviewed."
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
