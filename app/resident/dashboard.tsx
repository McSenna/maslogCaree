import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import StatCard from "@/components/ui/StatCard";
import InfoCard from "@/components/ui/InfoCard";
import { Paragraph } from "@/components/ui/Typography";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { ChartCard, DashboardHeader, DashboardShell } from "@/components/dashboard";
import { chartColors } from "@/design/dashboardTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { ResidentDashboardSkeleton } from "@/components/ui/Skeleton";
import {
  buildResidentNotifications,
  formatConsultationTypeLabel,
  formatNextVisitSummary,
  formatUpcomingCard,
  getTimeGreeting,
  summarizeResidentAppointments,
} from "@/utils/residentDashboard";

const ICON = chartColors.primary;

function statusLine(status: string) {
  if (status === "pending") return "Pending — in queue";
  if (status === "confirmed") return "Confirmed";
  if (status === "rescheduled") return "Rescheduled";
  if (status === "declined") return "Declined";
  return status;
}

function formatPastVisit(appt: { consultationType: string; status: string; slotStart?: string | null; createdAt?: string; declineReason?: string }) {
  const typeLabel = formatConsultationTypeLabel(appt.consultationType);
  const when = appt.slotStart
    ? new Date(appt.slotStart).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : appt.createdAt
      ? new Date(appt.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Date TBD";
  const desc =
    appt.status === "declined" && appt.declineReason
      ? appt.declineReason.slice(0, 160) + (appt.declineReason.length > 160 ? "…" : "")
      : `${statusLine(appt.status)} · Your appointment history from MaslogCare.`;
  return { title: `${when} · ${typeLabel}`, description: desc };
}

const ResidentDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { classes, resolvedTheme } = useTheme();
  const { appointments, loading, error } = useResidentAppointments();

  const summary = useMemo(
    () => summarizeResidentAppointments(appointments, chartColors.primary),
    [appointments]
  );

  const notifications = useMemo(
    () => buildResidentNotifications(appointments, summary),
    [appointments, summary]
  );

  const nextSummary = useMemo(
    () => formatNextVisitSummary(summary.nextAppointment, summary.pendingCount),
    [summary.nextAppointment, summary.pendingCount]
  );

  const upcomingCard = useMemo(
    () => formatUpcomingCard(summary.nextAppointment, summary.pendingCount),
    [summary.nextAppointment, summary.pendingCount]
  );

  const monthTrend =
    summary.lastMonthCount === 0
      ? { label: "New this month", direction: "neutral" as const }
      : {
          label:
            summary.thisMonthCount >= summary.lastMonthCount
              ? `${summary.thisMonthCount} vs ${summary.lastMonthCount} last month`
              : `${summary.thisMonthCount} vs ${summary.lastMonthCount} last month`,
          direction:
            summary.thisMonthCount > summary.lastMonthCount
              ? ("up" as const)
              : summary.thisMonthCount < summary.lastMonthCount
                ? ("down" as const)
                : ("neutral" as const),
        };

  const hasChartData = summary.monthlyBars.some((b) => b.value > 0);

  return (
    <DashboardShell
      loading={loading}
      skeleton={<ResidentDashboardSkeleton />}
    >
      <View className="gap-7">
        <DashboardHeader
          resident={{
            greeting: getTimeGreeting(),
            userName: user?.name ?? "Resident",
            avatarUrl: user?.avatarUrl ?? null,
            tagline: "Appointments and records synced from your account.",
          }}
          notifications={notifications}
        />

        {error ? (
          <View
            className={[
              "rounded-2xl border px-4 py-3",
              resolvedTheme === "dark" ? "border-rose-500/40 bg-rose-950/30" : "border-rose-200 bg-rose-50",
            ].join(" ")}
          >
            <Text
              className="text-sm"
              style={{ color: resolvedTheme === "dark" ? "#fecdd3" : "#be123c" }}
            >
              {error}
            </Text>
            <Paragraph className={`mt-1 text-xs ${classes.textMuted}`}>
              Pull to refresh by leaving and returning to this screen, or open Appointments.
            </Paragraph>
          </View>
        ) : null}

        <Section eyebrow="Overview" title="Summary">
          <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
            <StatCard
              label="Next appointment"
              value={nextSummary.value}
              helperText={nextSummary.helper}
              tone="primary"
              icon={<Feather name="calendar" size={22} color={ICON} />}
            />
            <StatCard
              label="Records"
              value={summary.recordsCount}
              helperText="Care requests and visits on file"
              icon={<Feather name="folder" size={22} color={ICON} />}
            />
            <StatCard
              label="Pending"
              value={summary.pendingCount}
              helperText="Awaiting scheduling from the health team"
              icon={<Feather name="clock" size={22} color={ICON} />}
            />
          </View>
        </Section>

        <Section eyebrow="Next visit" title="Upcoming">
          <InfoCard
            title={upcomingCard.title}
            description={upcomingCard.description}
            icon={<Feather name="heart" size={18} color={ICON} />}
            variant="featured"
          />
        </Section>

        <Section eyebrow="Analytics" title="Activity" subtitle="Based on your appointments">
          <View className="gap-4 lg:grid lg:grid-cols-3 lg:gap-5 lg:items-stretch">
            <View className="lg:col-span-2">
              <ChartCard title="Last 6 months">
                {hasChartData ? (
                  <SimpleBarChart data={summary.monthlyBars} height={120} />
                ) : (
                  <View className="min-h-[120px] justify-center py-4">
                    <Text className={`text-center text-sm ${classes.textMuted}`}>
                      No activity yet. Book an appointment to see trends here.
                    </Text>
                  </View>
                )}
              </ChartCard>
            </View>
            <View className="gap-4">
              <StatCard
                label="Total visits"
                value={summary.totalVisits}
                helperText="Completed scheduled visits"
                icon={<Feather name="activity" size={22} color={ICON} />}
              />
              <StatCard
                label="This month"
                value={summary.thisMonthCount}
                helperText="Slots or requests with activity this month"
                trend={monthTrend}
                icon={<Feather name="bar-chart-2" size={22} color={ICON} />}
              />
            </View>
          </View>
        </Section>

        <View className="gap-5 lg:grid lg:grid-cols-3 lg:gap-6">
          <View className="gap-4 lg:col-span-2">
            <Section eyebrow="History" title="Past visits">
              {summary.pastAppointments.length === 0 ? (
                <Text className={`text-sm ${classes.textMuted}`}>
                  Past visits appear here after completed or declined appointments.
                </Text>
              ) : (
                <View className="gap-3">
                  {summary.pastAppointments.map((appt) => {
                    const { title, description } = formatPastVisit(appt);
                    return (
                      <InfoCard
                        key={appt._id}
                        title={title}
                        description={description}
                        icon={<Feather name="file-text" size={18} color={ICON} />}
                      />
                    );
                  })}
                </View>
              )}
            </Section>
          </View>

          <View className="gap-4">
            <Section eyebrow="Community" title="Announcements">
              <View
                className={[
                  "rounded-2xl border px-4 py-5",
                  resolvedTheme === "dark" ? "border-slate-700/80 bg-slate-900/40" : "border-slate-200 bg-slate-50/80",
                ].join(" ")}
              >
                <Text className={`text-sm leading-relaxed ${classes.textMuted}`}>
                  Barangay announcements will appear here when your organization publishes them.
                </Text>
              </View>
            </Section>

            <Button
              variant="accent"
              title="Book appointment"
              onPress={() => router.push("/resident/appointments" as any)}
            />
          </View>
        </View>
      </View>
    </DashboardShell>
  );
};

export default ResidentDashboard;
