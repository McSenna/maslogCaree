import type { Feather } from "@expo/vector-icons";
import { MetricCard } from "@/components/dashboard/admin";
import {
  AttentionStrip,
  DashboardHeader,
  DashboardScroll,
  DashboardSkeleton,
  MetricRow,
  SplitRow,
  greetingLine,
  longDate,
  updatedLabel,
  useDashboardLayout,
  useMinuteClock,
  type AttentionItem,
  type DashboardAction,
} from "@/components/dashboard/kit";
import ErrorState from "@/components/feedback/ErrorState";
import { getAdminDashboardPalette, type MetricTone } from "@/design/adminDashboardTheme";
import AnnouncementsList from "@/features/resident/AnnouncementsList";
import ResidentAppointmentsTable from "@/features/resident/ResidentAppointmentsTable";
import UpcomingAppointment from "@/features/resident/UpcomingAppointment";
import VisitsChartCard from "@/features/resident/VisitsChartCard";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import type { NextAppointment } from "@/services/residentDashboardService";
import type { StatItem } from "@/types/residentDashboard";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";
import { useResidentDashboard } from "./useResidentDashboard";

// Resident screens are light-only (they share the fixed RESIDENT_COLORS cards), so the dashboard uses the light palette.
const palette = getAdminDashboardPalette("light");

const STAT_VISUALS: Record<string, { icon: keyof typeof Feather.glyphMap; tone: MetricTone; label: string }> = {
  upcoming: { icon: "calendar", tone: "blue", label: "Upcoming visits" },
  completed: { icon: "check-circle", tone: "green", label: "Completed visits" },
  records: { icon: "file-text", tone: "purple", label: "Health records" },
  announcements: { icon: "bell", tone: "amber", label: "New announcements" },
};

const SKELETON_ROWS = [
  { weights: [1, 1], height: 280 },
  { weights: [1.4, 1], height: 320 },
];

const slotLabel = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date}, ${time}`;
};

const nextVisitLine = (next: NextAppointment | null): string => {
  if (!next) return "No upcoming visits";
  const when = slotLabel(next.slotStart);
  const service = formatConsultationTypeLabel(next.consultationType);
  return when ? `Next: ${service}, ${when}` : `${service} request waiting for a slot`;
};

const ResidentDashboard = () => {
  const router = useGuardedNavigation();
  const layout = useDashboardLayout();
  const model = useResidentDashboard();
  const now = useMinuteClock();
  const { handlers } = model;
  const { isMobile, gap, stackPanels } = layout;

  const nothingLoaded = !model.nextAppointment && model.stats.every((stat) => stat.value === 0);

  const book = () => router.push("/resident/appointments?book=1" as never);
  const primaryAction: DashboardAction = { key: "book", label: "Book appointment", icon: "plus", onPress: book };
  const secondaryActions: DashboardAction[] = [
    {
      key: "records",
      label: "Medical records",
      icon: "file-text",
      onPress: () => router.push("/resident/medical-records"),
    },
  ];

  const attention: AttentionItem[] = [];
  if (model.nextAppointment?.status === "rescheduled") {
    attention.push({
      key: "rescheduled",
      icon: "refresh-cw",
      tone: "warning",
      title: "Your visit was moved",
      detail: `New time: ${slotLabel(model.nextAppointment.slotStart) || "to be confirmed"}`,
      onPress: handlers.onViewAllAppointments,
    });
  }
  if (model.unreadAnnouncements > 0) {
    attention.push({
      key: "announcements",
      icon: "bell",
      tone: "info",
      title: `${model.unreadAnnouncements} new ${model.unreadAnnouncements === 1 ? "announcement" : "announcements"}`,
      detail: "From your barangay health center",
      onPress: handlers.onViewAllAnnouncements,
    });
  }

  const metric = (stat: StatItem) => {
    const visual = STAT_VISUALS[stat.id];
    return (
      <MetricCard
        key={stat.id}
        palette={palette}
        tone={visual?.tone ?? "blue"}
        icon={visual?.icon ?? "circle"}
        label={visual?.label ?? stat.label}
        value={stat.value}
        description={stat.caption}
        compact={isMobile}
        dense={layout.denseMetrics}
      />
    );
  };

  if (model.error && nothingLoaded && !model.loading) {
    return <ErrorState title="Unable to load your dashboard" message={model.error} onRetry={model.reload} />;
  }

  const upcoming = (
    <UpcomingAppointment
      palette={palette}
      fill={!stackPanels}
      compact={isMobile}
      appointment={model.nextAppointment}
      onViewAll={handlers.onViewAllAppointments}
      onViewDetails={handlers.onViewAppointment}
      onBook={book}
    />
  );
  const visits = <VisitsChartCard palette={palette} months={model.monthlyVisits} compact={isMobile} fill={!stackPanels} />;
  const table = (
    <ResidentAppointmentsTable
      palette={palette}
      appointments={model.appointments}
      compact={isMobile}
      onOpen={handlers.onViewAppointment}
      onViewAll={handlers.onViewAllAppointments}
      fill={!stackPanels}
    />
  );
  const announcements = (
    <AnnouncementsList
      palette={palette}
      fill={!stackPanels}
      announcements={model.announcements}
      onViewAll={handlers.onViewAllAnnouncements}
      onAnnouncementPress={handlers.onAnnouncement}
    />
  );

  return (
    <DashboardScroll
      palette={palette}
      insets={layout.insets}
      refreshing={model.refreshing}
      onRefresh={model.refresh}
      onMeasure={layout.measure}
      gap={isMobile ? 16 : 20}
    >
      <DashboardHeader
        palette={palette}
        compact={isMobile}
        title={greetingLine(model.fullName, now)}
        subtitle={model.loading ? longDate(now) : `${longDate(now)} · ${nextVisitLine(model.nextAppointment)}`}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        updatedLabel={model.loadedAt ? updatedLabel(model.loadedAt, now) : undefined}
        onRefresh={model.loadedAt ? model.refresh : undefined}
        refreshing={model.refreshing}
      />

      {model.loading ? (
        <DashboardSkeleton
          palette={palette}
          compact={isMobile}
          metricColumns={layout.metricColumns}
          gap={gap}
          rows={SKELETON_ROWS}
        />
      ) : (
        <>
          <AttentionStrip palette={palette} items={attention} compact={isMobile} />

          <MetricRow columns={layout.metricColumns} gap={gap}>
            {model.stats.map(metric)}
          </MetricRow>

          {isMobile ? (
            <>
              {upcoming}
              {table}
              {visits}
              {announcements}
            </>
          ) : (
            <>
              <SplitRow weights={[1, 1]} stacked={stackPanels} gap={gap}>
                {upcoming}
                {visits}
              </SplitRow>
              <SplitRow weights={[1.4, 1]} stacked={stackPanels} gap={gap}>
                {table}
                {announcements}
              </SplitRow>
            </>
          )}
        </>
      )}
    </DashboardScroll>
  );
};

export default ResidentDashboard;
