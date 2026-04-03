import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import AppointmentModal from "@/components/ui/AppointmentModal";
import InfoCard from "@/components/ui/InfoCard";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";

function statusLabel(s: string) {
  if (s === "pending") return "Pending — in queue";
  if (s === "confirmed") return "Confirmed";
  if (s === "rescheduled") return "Rescheduled";
  if (s === "declined") return "Declined";
  return s;
}

function formatWhen(appt: { slotStart?: string | null; createdAt?: string }) {
  if (!appt.slotStart) {
    return appt.createdAt
      ? `Requested ${new Date(appt.createdAt).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}`
      : "Awaiting doctor schedule";
  }
  const d = new Date(appt.slotStart);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const ResidentAppointments = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { classes, resolvedTheme } = useTheme();
  const { appointments, loading, error, refresh } = useResidentAppointments();

  return (
    <ScrollView className={`flex-1 ${classes.scrollBg}`} showsVerticalScrollIndicator={false}>
      <View className="gap-6 pb-4">
        <View className="flex-row flex-wrap items-start justify-between gap-3">
          <View className="min-w-0 flex-1" style={{ minWidth: 200 }}>
            <PageTitle>Appointments</PageTitle>
            <PageSubtitle>
              Request a mission visit and track scheduling from your health team.
            </PageSubtitle>
          </View>
          <Pressable
            onPress={() => setModalOpen(true)}
            className="rounded-xl bg-mc-primary px-4 py-3 active:opacity-90"
          >
            <Text className="font-semibold text-white">New request</Text>
          </Pressable>
        </View>

        <Text className={`text-sm leading-relaxed ${classes.textMuted}`}>
          Your request joins the mission queue. Date and time appear here after a doctor assigns your slot.
        </Text>

        {loading ? (
          <View className="gap-3">
            <StatCardSkeleton />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </View>
        ) : error ? (
          <Text style={{ color: resolvedTheme === "dark" ? "#fecdd3" : "#be123c" }} className="text-sm">
            {error}
          </Text>
        ) : appointments.length === 0 ? (
          <InfoCard
            title="No appointments yet"
            description="Tap “New request” to join the medical mission queue."
            icon={<Feather name="calendar" size={18} color="#2D5BFF" />}
          />
        ) : (
          <View className="gap-3">
            {appointments.map((appt) => (
              <InfoCard
                key={appt._id}
                title={`${formatConsultationTypeLabel(appt.consultationType)} · ${statusLabel(appt.status)}`}
                description={`When: ${formatWhen(appt)}${
                  appt.assignedCategoryKey ? ` · Category: ${appt.assignedCategoryKey}` : ""
                }${appt.description ? `\nNote: ${appt.description}` : ""}`}
                icon={<Feather name="calendar" size={18} color="#2D5BFF" />}
              />
            ))}
          </View>
        )}

        <AppointmentModal visible={modalOpen} onClose={() => setModalOpen(false)} onBooked={() => void refresh()} />
      </View>
    </ScrollView>
  );
};

export default ResidentAppointments;
