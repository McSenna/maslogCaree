import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import StatCard from "../../components/ui/StatCard";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function AdminReports() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Reports</PageTitle>
          <PageSubtitle>
            View and generate healthcare analytics and reports.
          </PageSubtitle>
        </View>

        <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
          <StatCard
            label="Monthly Consultations"
            value="342"
            helperText="March 2026"
            tone="primary"
            icon={<Feather name="activity" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Vaccinations"
            value="156"
            helperText="This quarter"
            icon={<Feather name="shield" size={22} color="#2D5BFF" />}
          />
          <StatCard
            label="Home Visits"
            value="89"
            helperText="BHW community visits"
            icon={<Feather name="map-pin" size={22} color="#2D5BFF" />}
          />
        </View>

        <View className="gap-3">
          <InfoCard
            title="Consultation Report"
            description="View detailed consultation statistics by date range and provider."
            icon={<Feather name="file-text" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Vaccination Coverage"
            description="Track vaccination rates by age group and vaccine type."
            icon={<Feather name="bar-chart-2" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
