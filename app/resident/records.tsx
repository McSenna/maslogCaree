import { Feather } from "@expo/vector-icons";
import { useMemo, type ComponentProps } from "react";
import { ScrollView, Text, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { getAssignedStaffName, statusLabel } from "@/utils/appointmentDisplay";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";

type IconName = ComponentProps<typeof Feather>["name"];

function formatWhen(appt: { slotStart?: string | null; createdAt?: string }) {
  const raw = appt.slotStart || appt.createdAt;
  if (!raw) return "Date not set";
  return new Date(raw).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: appt.slotStart ? "numeric" : undefined,
    minute: appt.slotStart ? "2-digit" : undefined,
  });
}

const STATUS_ICON: Record<string, IconName> = {
  pending: "clock",
  confirmed: "check-circle",
  rescheduled: "rotate-ccw",
  declined: "x-circle",
};

const STATUS_TONE: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", icon: "#D97706" },
  confirmed: { bg: "bg-teal-50", text: "text-teal-700", icon: "#0D9488" },
  rescheduled: { bg: "bg-violet-50", text: "text-violet-700", icon: "#7C3AED" },
  declined: { bg: "bg-rose-50", text: "text-rose-700", icon: "#E11D48" },
  default: { bg: "bg-slate-100", text: "text-slate-700", icon: "#475569" },
};

type StatTone = "blue" | "amber" | "teal";

const STAT_TONE: Record<StatTone, { bg: string; icon: string; value: string }> = {
  blue: { bg: "bg-blue-50", icon: "#2D5BFF", value: "text-blue-600" },
  amber: { bg: "bg-amber-50", icon: "#D97706", value: "text-amber-600" },
  teal: { bg: "bg-teal-50", icon: "#0D9488", value: "text-teal-600" },
};

type StatCardProps = {
  label: string;
  value: number;
  icon: IconName;
  tone?: StatTone;
};

function StatCard({ label, value, icon, tone = "blue" }: StatCardProps) {
  const t = STAT_TONE[tone];
  return (
    <View
      className="flex-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4"
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View className={`h-9 w-9 items-center justify-center rounded-full ${t.bg}`}>
        <Feather name={icon} size={16} color={t.icon} />
      </View>
      <View className="gap-0.5">
        <Text className={`text-2xl font-bold ${t.value}`}>{value}</Text>
        <Text className="text-xs font-medium text-slate-500">{label}</Text>
      </View>
    </View>
  );
}

type RecordCardProps = {
  typeLabel: string;
  status: string;
  when: string;
  staff?: string;
  description?: string;
  declineReason?: string;
};

function RecordCard({ typeLabel, status, when, staff, description, declineReason }: RecordCardProps) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.default;
  const icon = STATUS_ICON[status] ?? "activity";
  const hasNotes = Boolean(description || declineReason);

  return (
    <View
      className="gap-3 rounded-2xl border border-slate-200 bg-white p-4"
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${typeLabel}, ${statusLabel(status)}, ${when}${staff ? `, ${staff}` : ""}`}
    >
      <View className="flex-row items-center gap-3">
        <View className={`h-10 w-10 items-center justify-center rounded-full ${tone.bg}`}>
          <Feather name={icon} size={16} color={tone.icon} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-slate-900" numberOfLines={1}>
            {typeLabel}
          </Text>
          <Text className="text-xs text-slate-500" numberOfLines={1}>
            {when}
            {staff ? ` · ${staff}` : ""}
          </Text>
        </View>
        <View className={`rounded-full px-2.5 py-1 ${tone.bg}`}>
          <Text className={`text-xs font-semibold ${tone.text}`}>{statusLabel(status)}</Text>
        </View>
      </View>

      {hasNotes ? (
        <View className="gap-1 border-t border-slate-100 pt-3">
          {description ? <Text className="text-sm leading-5 text-slate-600">{description}</Text> : null}
          {declineReason ? (
            <Text className="text-sm leading-5 text-rose-600">Note: {declineReason}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function ResidentRecords() {
  const { classes } = useTheme();
  const { appointments, loading, error } = useResidentAppointments();

  const sorted = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const ta = new Date(a.slotStart || a.createdAt || 0).getTime();
      const tb = new Date(b.slotStart || b.createdAt || 0).getTime();
      return tb - ta;
    });
  }, [appointments]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    return { total, pending, confirmed };
  }, [appointments]);

  return (
    <ScrollView className={`flex-1 ${classes.scrollBg}`} showsVerticalScrollIndicator={false}>
      <View className="gap-6 pb-8">
        <View className="gap-1">
          <PageTitle>Medical records</PageTitle>
          <PageSubtitle>
            Your care timeline from MaslogCare — each appointment request and visit appears here.
          </PageSubtitle>
        </View>

        {loading ? (
          <View className="gap-3">
            <StatCardSkeleton />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </View>
        ) : error ? (
          <View className="flex-row items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <Feather name="alert-circle" size={18} color="#E11D48" />
            <Text className="flex-1 text-sm leading-5 text-rose-700">{error}</Text>
          </View>
        ) : sorted.length === 0 ? (
          <InfoCard
            title="No records yet"
            description="When you book appointments, they will show up here as your health timeline."
            icon={<Feather name="file-text" size={18} color="#2D5BFF" />}
          />
        ) : (
          <View className="gap-5">
            <View className="flex-row gap-3">
              <StatCard label="Total" value={stats.total} icon="calendar" tone="blue" />
              <StatCard label="Pending" value={stats.pending} icon="clock" tone="amber" />
              <StatCard label="Confirmed" value={stats.confirmed} icon="check-circle" tone="teal" />
            </View>

            <View className="gap-3">
              {sorted.map((appt) => {
                const typeLabel = formatConsultationTypeLabel(appt.consultationType);
                const staff = getAssignedStaffName(appt.assignedBy);
                return (
                  <RecordCard
                    key={appt._id}
                    typeLabel={typeLabel}
                    status={appt.status}
                    when={formatWhen(appt)}
                    staff={staff}
                    description={appt.description}
                    declineReason={appt.declineReason}
                  />
                );
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}