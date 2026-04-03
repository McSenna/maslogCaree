import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import InfoCard from "@/components/ui/InfoCard";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";

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

function statusLabel(s: string) {
  if (s === "pending") return "Pending";
  if (s === "confirmed") return "Confirmed";
  if (s === "rescheduled") return "Rescheduled";
  if (s === "declined") return "Declined";
  return s;
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
          <Text className="text-sm text-rose-600">{error}</Text>
        ) : sorted.length === 0 ? (
          <InfoCard
            title="No records yet"
            description="When you book appointments, they will show up here as your health timeline."
            icon={<Feather name="file-text" size={18} color="#2D5BFF" />}
          />
        ) : (
          <View className="gap-3">
            {sorted.map((appt) => {
              const typeLabel = formatConsultationTypeLabel(appt.consultationType);
              const staff =
                appt.assignedBy && typeof appt.assignedBy === "object" && "fullname" in appt.assignedBy
                  ? String((appt.assignedBy as { fullname?: string }).fullname || "").trim()
                  : "";
              return (
                <InfoCard
                  key={appt._id}
                  title={`${typeLabel} · ${statusLabel(appt.status)}`}
                  description={`${formatWhen(appt)}${staff ? ` · ${staff}` : ""}${
                    appt.description ? `\n${appt.description}` : ""
                  }${appt.declineReason ? `\nNote: ${appt.declineReason}` : ""}`}
                  icon={<Feather name="activity" size={18} color="#2D5BFF" />}
                />
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
