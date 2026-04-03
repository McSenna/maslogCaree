import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import Section from "@/components/ui/Section";
import { DashboardHeader, DashboardShell } from "@/components/dashboard";
import { chartColors } from "@/design/dashboardTheme";

const ICON = chartColors.primary;

export default function DoctorDashboard() {
  return (
    <DashboardShell>
      <View className="gap-7">
        <DashboardHeader
          title="Clinical workspace"
          subtitle="Operational tools live under Patients, Consultations, and Mission. Dashboard charts will populate when analytics APIs are enabled."
          roleBadge="Doctor"
          notifications={[]}
        />

        <Section eyebrow="Overview" title="At a glance">
          <InfoCard
            title="Live metrics pending"
            description="This screen no longer shows sample patients or visit numbers. Connect roster and scheduling analytics to the API to populate KPIs here."
            icon={<Feather name="activity" size={18} color={ICON} />}
          />
        </Section>
      </View>
    </DashboardShell>
  );
}
