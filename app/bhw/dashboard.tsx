import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import Section from "@/components/ui/Section";
import { DashboardHeader, DashboardShell } from "@/components/dashboard";
import { chartColors } from "@/design/dashboardTheme";

const ICON = chartColors.primary;

export default function BhwDashboard() {
  return (
    <DashboardShell>
      <View className="gap-7">
        <DashboardHeader
          title="Community field ops"
          subtitle="Use Residents, Visits, and Reports for day-to-day work. Coverage metrics will appear here when backend summaries are available."
          roleBadge="BHW"
          notifications={[]}
        />

        <Section eyebrow="Overview" title="At a glance">
          <InfoCard
            title="Live metrics pending"
            description="Sample visit counts and charts were removed. Wire BHW analytics endpoints to show real barangay coverage."
            icon={<Feather name="map-pin" size={18} color={ICON} />}
          />
        </Section>
      </View>
    </DashboardShell>
  );
}
