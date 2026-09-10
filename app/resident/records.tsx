import { Feather } from "@expo/vector-icons";
import { useMemo, type ComponentProps } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { useResidentMedicalRecords } from "@/hooks/useResidentMedicalRecords";
import MedicalRecordDetails from "@/components/medicalRecord/MedicalRecordDetails";
import type { MedicalRecord } from "@/services/medicalRecords";
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
  processing: "activity",
  completed: "check-circle",
};

const STATUS_TONE: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", icon: "#D97706" },
  confirmed: { bg: "bg-teal-50", text: "text-teal-700", icon: "#0D9488" },
  rescheduled: { bg: "bg-violet-50", text: "text-violet-700", icon: "#7C3AED" },
  declined: { bg: "bg-rose-50", text: "text-rose-700", icon: "#E11D48" },
  processing: { bg: "bg-violet-50", text: "text-violet-700", icon: "#7C3AED" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "#059669" },
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

/**
 * One completed visit's record.
 *
 * Distinct from `RecordCard` below, which is an appointment. This is what came
 * out of one — the thing a resident actually wants when they open this screen,
 * so it leads. It shows what the visit was and who saw them; the findings are
 * one tap away rather than on the card, because a clinical summary is not
 * something to leave open on a phone in a waiting room.
 */
function MedicalRecordCard({
  record,
  onOpen,
}: {
  record: MedicalRecord;
  onOpen: (record: MedicalRecord) => void;
}) {
  const provider = typeof record.provider === "object" ? record.provider?.fullname : undefined;
  const when = record.completedAt
    ? new Date(record.completedAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <View
      className="gap-3 rounded-2xl border border-slate-200 bg-white p-4"
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${formatConsultationTypeLabel(record.serviceType)}, completed ${when}${provider ? `, ${provider}` : ""}`}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
          <Feather name="file-text" size={16} color="#059669" />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-slate-900" numberOfLines={1}>
            {formatConsultationTypeLabel(record.serviceType)}
          </Text>
          <Text className="text-xs text-slate-500" numberOfLines={1}>
            {when}
            {provider ? ` · ${provider}` : ""}
          </Text>
        </View>
        <View className="rounded-full bg-emerald-50 px-2.5 py-1">
          <Text className="text-xs font-semibold text-emerald-700">Completed</Text>
        </View>
      </View>

      {record.followUpRequired ? (
        <View className="flex-row items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
          <Feather name="calendar" size={13} color="#D97706" />
          <Text className="flex-1 text-xs font-medium text-amber-700">
            Follow-up
            {record.followUpDate
              ? ` on ${new Date(record.followUpDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
              : " to be arranged"}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => onOpen(record)}
        accessibilityRole="button"
        accessibilityLabel={`View the medical record for ${formatConsultationTypeLabel(record.serviceType)} on ${when}`}
        className="h-10 flex-row items-center justify-center gap-2 rounded-xl border border-slate-200"
      >
        <Feather name="eye" size={14} color="#2D5BFF" />
        <Text className="text-sm font-semibold text-blue-600">View Medical Record</Text>
      </Pressable>
    </View>
  );
}

export default function ResidentRecords() {
  const { classes } = useTheme();
  const { appointments, loading, error } = useResidentAppointments();
  const medical = useResidentMedicalRecords();

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
    // Completed is the figure worth showing beside the total now that a
    // completed visit produces something to read. Approved is a step on the
    // way, and the timeline below already shows which are still to come.
    const completed = appointments.filter((a) => a.status === "completed").length;
    return { total, pending, completed };
  }, [appointments]);

  return (
    <>
    <ScrollView className={`flex-1 ${classes.scrollBg}`} showsVerticalScrollIndicator={false}>
      <View className="gap-6 pb-8">
        <View className="gap-1">
          <PageTitle>Medical records</PageTitle>
          <PageSubtitle>
            Your care history from MaslogCare — what your health worker recorded, and every appointment you
            have booked.
          </PageSubtitle>
        </View>

        {/* The clinical history leads: these are the visits that produced
            something to read. Loading is quiet — the appointment timeline
            below carries the screen's own loading and error states, and two
            spinners for one page would say less, not more. */}
        {medical.records.length ? (
          <View className="gap-3">
            <Text className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Medical records
            </Text>
            {medical.records.map((record) => (
              <MedicalRecordCard key={record._id} record={record} onOpen={(r) => void medical.openRecord(r)} />
            ))}
          </View>
        ) : null}

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
              <StatCard label="Completed" value={stats.completed} icon="check-circle" tone="teal" />
            </View>

            <View className="gap-3">
              <Text className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Appointment history
              </Text>
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

    {/* Read-only, and with the health worker's own notes withheld — the
        server already leaves that column out of a resident's endpoint, so
        this is the second of two locks rather than the only one. */}
    <MedicalRecordDetails
      visible={Boolean(medical.viewing)}
      record={medical.viewing?.record ?? null}
      form={medical.viewing?.form ?? null}
      onClose={medical.closeRecord}
      showProviderNotes={false}
    />
    </>
  );
}