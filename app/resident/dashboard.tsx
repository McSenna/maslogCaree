import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import StatCard from "../../components/ui/StatCard";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle, Paragraph } from "../../components/ui/Typography";

export default function ResidentDashboard() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View className="gap-1">
          <PageTitle>Resident Dashboard</PageTitle>
          <PageSubtitle>
            View your upcoming appointments, announcements, and history.
          </PageSubtitle>
        </View>

        <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
          <StatCard
            label="Next Appointment"
            value="Mar 20, 2026"
            helperText="General Checkup with Dr. Maria Santos"
            tone="primary"
            icon={<Feather name="calendar" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Total Appointments"
            value={8}
            helperText="Completed visits recorded in MASLOG CARE"
            icon={<Feather name="trending-up" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Pending Requests"
            value={1}
            helperText="Awaiting confirmation from health center"
            icon={<Feather name="clock" size={22} color="#2D5BFF" />}
          />
        </View>

        <View className="gap-5 md:grid md:grid-cols-3 md:gap-6">
          <View className="gap-3 md:col-span-2">
            <PageTitle className="text-lg md:text-xl">
              Upcoming Appointment
            </PageTitle>
            <InfoCard
              title="General Checkup – March 20, 2026"
              description="Doctor: Dr. Maria Santos · Time: 10:30 AM · Purpose: Routine general checkup and follow‑up."
              icon={<Feather name="heart" size={18} color="#2D5BFF" />}
            />

            <PageTitle className="mt-2 text-lg md:text-xl">
              Appointment History
            </PageTitle>
            <InfoCard
              title="February 10, 2026 – Consultation"
              description="Completed · Doctor: Dr. Maria Santos · Diagnosis: Mild flu · Status: Recovered."
            />
            <InfoCard
              title="January 5, 2026 – Vaccination"
              description="Completed · Vaccine: Influenza · Status: Recorded in barangay health log."
            />
          </View>

          <View className="gap-3">
            <PageTitle className="text-lg md:text-xl">
              Health Announcements
            </PageTitle>
            <InfoCard
              title="Vaccination Program – March 25, 2026"
              description="Bring your child's health card and barangay ID for verification."
            />
            <InfoCard
              title="Community Health Day – April 10, 2026"
              description="Free blood pressure and diabetes screening for residents."
            />

            <Pressable className="mt-2 rounded-2xl bg-mc-accent py-3 shadow-sm shadow-mc-accent/40">
              <Text className="text-center text-sm font-semibold text-white">
                Book Appointment
              </Text>
            </Pressable>

            <Paragraph className="mt-1 text-xs text-slate-500">
              This is a sample resident view with temporary data. Booking will
              be connected to the actual appointment flow in a later phase.
            </Paragraph>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
