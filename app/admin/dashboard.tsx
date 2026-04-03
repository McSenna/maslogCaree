import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View } from "react-native";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Section from "@/components/ui/Section";
import { DashboardHeader, DashboardShell } from "@/components/dashboard";
import { chartColors } from "@/design/dashboardTheme";

const ICON = chartColors.primary;

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <DashboardShell>
      <View className="gap-7">
        <DashboardHeader
          title="Administration"
          subtitle="User management and reports are available from the sidebar. Aggregate analytics will appear here when wired to the API."
          roleBadge="Admin"
          notifications={[]}
        />

        <Section eyebrow="Overview" title="At a glance">
          <InfoCard
            title="Live metrics pending"
            description="Sample workforce counts, charts, and events were removed. Connect admin reporting endpoints to populate this dashboard."
            icon={<Feather name="pie-chart" size={18} color={ICON} />}
          />
        </Section>

        <Section eyebrow="Shortcuts" title="Go to">
          <View className="gap-3 md:flex-row md:flex-wrap">
            <Button variant="accent" title="Users" onPress={() => router.push("/admin/users" as any)} />
            <Button variant="secondary" title="Reports" onPress={() => router.push("/admin/reports" as any)} />
            <Button variant="secondary" title="Settings" onPress={() => router.push("/admin/settings" as any)} />
          </View>
        </Section>
      </View>
    </DashboardShell>
  );
}
