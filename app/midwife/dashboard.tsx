import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import Section from "@/components/ui/Section";
import { DashboardHeader, DashboardShell } from "@/components/dashboard";
import { chartColors } from "@/design/dashboardTheme";

const ICON = chartColors.primary;

export default function MidwifeDashboard() {
  return (
    <DashboardShell>
      <View className="gap-7">
        <DashboardHeader
          title="Maternal care hub"
          subtitle="Patients and consultations are available from the sidebar. Caseload analytics will display when connected to the API."
          roleBadge="Midwife"
          notifications={[]}
        />

        <Section eyebrow="Overview" title="At a glance">
          <InfoCard
            title="Live metrics pending"
            description="Mock schedules and birth statistics were removed. Hook this view to maternal health reporting services for real caseload data."
            icon={<Feather name="heart" size={18} color={ICON} />}
          />
        </Section>
      </View>
    </DashboardShell>
  );
}
