import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import StatCard from "@/components/ui/StatCard";
import InfoCard from "@/components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";

export default function BhwDashboard() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Barangay Health Worker Dashboard</PageTitle>
          <PageSubtitle>
            Monitor assigned residents, vaccination programs, and community
            health activities.
          </PageSubtitle>
        </View>

        <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
          <StatCard
            label="Assigned Residents"
            value={85}
            helperText="Residents under your active monitoring"
            tone="primary"
            icon={<Feather name="users" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Upcoming Visits"
            value={6}
            helperText="Home visits scheduled this week"
            icon={<Feather name="map-pin" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Open Tasks"
            value={9}
            helperText="Vaccinations, follow‑ups, and documentation"
            icon={<Feather name="clipboard" size={22} color="#2D5BFF" />}
          />
        </View>

        <View className="gap-5 md:grid md:grid-cols-2 md:gap-6">
          <View className="gap-3">
            <PageTitle className="text-lg md:text-xl">
              Community Health Programs
            </PageTitle>
            <InfoCard
              title="Vaccination Program – March 25, 2026"
              description="Coordinate with parents of children ages 0–5 and ensure all assigned residents are informed."
              icon={<Feather name="shield" size={18} color="#2D5BFF" />}
            />
            <InfoCard
              title="Health Seminar – April 2, 2026"
              description="Assist in registration and preparation of educational materials for nutrition awareness."
              icon={<Feather name="book-open" size={18} color="#2D5BFF" />}
            />
          </View>

          <View className="gap-3">
            <PageTitle className="text-lg md:text-xl">
              Appointment Assistance
            </PageTitle>
            <InfoCard
              title="Follow‑up for Senior Residents"
              description="Assist seniors in booking follow‑up appointments and arranging transportation if needed."
            />
            <InfoCard
              title="Vaccination Tracking"
              description="Track which assigned residents have completed their scheduled vaccinations."
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
