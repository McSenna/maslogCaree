import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";
import StatCard from "@/components/ui/StatCard";
import SimpleLineChart from "@/components/ui/charts/SimpleLineChart";
import { ChartCard, DashboardShell } from "@/components/dashboard";
import { chartColors } from "@/design/dashboardTheme";
/** auth not needed in simplified dashboard view */
// import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { ResidentDashboardSkeleton } from "@/components/ui/Skeleton";
import { summarizeResidentAppointments } from "@/utils/residentDashboard";

const ICON = chartColors.primary;

const ResidentDashboard = () => {
  const { classes, resolvedTheme } = useTheme();
  const { appointments, loading, error } = useResidentAppointments();

  const summary = useMemo(
    () => summarizeResidentAppointments(appointments, chartColors.primary),
    [appointments]
  );

  

  const hasChartData = summary.monthlyBars.some((b) => b.value > 0);

  const labels = summary.monthlyBars.map((b) => b.label);
  const values = summary.monthlyBars.map((b) => b.value);

  return (
    <DashboardShell loading={loading} skeleton={<ResidentDashboardSkeleton />}>
      <View className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-8">
        {error ? (
          <View
            className={[
              "rounded-2xl border px-4 py-3 mb-4",
              resolvedTheme === "dark" ? "border-rose-500/40 bg-rose-950/30" : "border-rose-200 bg-rose-50",
            ].join(" ")}
          >
            <Text className="text-sm" style={{ color: resolvedTheme === "dark" ? "#fecdd3" : "#be123c" }}>
              {error}
            </Text>
            <Text className={`mt-1 text-xs ${classes.textMuted}`}>Pull to refresh or open Appointments.</Text>
          </View>
        ) : null}

        {/* Stats grid: 4 across on desktop, 2x2 on mobile */}
        <View className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
          <StatCard label="Records" value={summary.recordsCount} icon={<Feather name="folder" size={40} color={ICON} />} />
          <StatCard label="In Queue" value={summary.pendingCount} icon={<Feather name="clock" size={40} color={ICON} />} />
          <StatCard label="Total Visits" value={summary.totalVisits} icon={<Feather name="activity" size={40} color={ICON} />} />
          <StatCard label="This Month" value={summary.thisMonthCount} icon={<Feather name="bar-chart-2" size={40} color={ICON} />} />
        </View>

        {/* Visit Analytics */}
        <ChartCard title="Visit Analytics" right={<Text className={`text-xs ${classes.textMuted}`}>Healthcare visits over time</Text>}>
          {hasChartData ? (
            <SimpleLineChart
              labels={labels}
              series={[{ values, color: chartColors.primary, showArea: true, label: "Visits" }]}
              height={360}
              showLegend={false}
            />
          ) : (
            <View className="min-h-[160px] flex items-center justify-center">
              <Text className={`text-center text-sm ${classes.textMuted}`}>No activity yet. Book an appointment to see trends here.</Text>
            </View>
          )}
        </ChartCard>
      </View>
    </DashboardShell>
  );
};

export default ResidentDashboard;
