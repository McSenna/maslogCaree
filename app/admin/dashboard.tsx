import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import StatCard from "../../components/ui/StatCard";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function AdminDashboard() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Admin Dashboard</PageTitle>
          <PageSubtitle>
            Overview of residents, appointments, and healthcare operations in
            Barangay Maslog.
          </PageSubtitle>
        </View>

        <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
          <StatCard
            label="Total Residents"
            value="1,240"
            helperText="Registered in the MASLOG CARE system"
            tone="primary"
            icon={<Feather name="users" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Appointments Today"
            value={35}
            helperText="Including walk-in and scheduled visits"
            icon={<Feather name="calendar" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Pending Requests"
            value={12}
            helperText="Awaiting confirmation by staff"
            icon={<Feather name="clock" size={22} color="#2D5BFF" />}
          />
        </View>

        <View className="gap-4 md:grid md:grid-cols-2 md:gap-5">
          <View className="gap-3">
            <PageTitle className="text-lg md:text-xl">
              Announcements Management
            </PageTitle>
            <InfoCard
              title="Upcoming Health Programs"
              description="Review and publish new announcements for vaccination drives, medical missions, and health seminars."
            />
            <InfoCard
              title="Draft: Community Health Day"
              description="Scheduled for April 10, 2026. Pending final approval from the Barangay Health Committee."
            />
          </View>

          <View className="gap-3">
            <PageTitle className="text-lg md:text-xl">
              Healthcare Staff List
            </PageTitle>
            <InfoCard
              title="Dr. Maria Santos"
              description="General Physician – Primary care and consultations."
            />
            <InfoCard
              title="Nurse Team"
              description="Responsible for triage, vital signs, and follow‑up care."
            />
            <InfoCard
              title="Barangay Health Workers"
              description="On-the-ground support for residents, vaccination, and health education."
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
