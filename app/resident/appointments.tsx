import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import InfoCard from "@/components/ui/InfoCard";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import AppointmentCard from "@/features/appointments/components/AppointmentCard";
import AppointmentDetailSheet from "@/features/appointments/components/AppointmentDetailSheet";
import AppointmentModal from "@/features/appointments/components/AppointmentModal";
import ResidentAppointmentOverlays from "@/features/appointments/components/ResidentAppointmentOverlays";
import { useResidentAppointmentActions } from "@/features/appointments/hooks/useResidentAppointmentActions";
import { useMedicalRecordViewer } from "@/hooks/useMedicalRecordViewer";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import type { AppointmentRecord } from "@/services/appointments";

const ResidentAppointments = () => {
  const { classes, resolvedTheme } = useTheme();
  const palette = useQueuePalette();

  const { appointments, loading, error, refresh } = useResidentAppointments();
  const actions = useResidentAppointmentActions(refresh);
  const recordViewer = useMedicalRecordViewer();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selected, setSelected] = useState<AppointmentRecord | null>(null);

  const openRecord = (recordId: string) => {
    setSelected(null);
    void recordViewer.openById(recordId);
  };

  const body = () => {
    if (loading) {
      return (
        <View className="gap-3">
          <StatCardSkeleton />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </View>
      );
    }

    if (error) {
      return (
        <Text
          className="text-sm"
          style={{ color: resolvedTheme === "dark" ? "#fecdd3" : "#be123c" }}
        >
          {error}
        </Text>
      );
    }

    if (!appointments.length) {
      return (
        <InfoCard
          title="No appointments yet"
          description="Tap “New request” to join the medical mission queue."
          icon={<Feather name="calendar" size={18} color="#2D5BFF" />}
        />
      );
    }

    return (
      <View className="gap-3">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            palette={palette}
            onOpen={setSelected}
            onReschedule={actions.startReschedule}
            onCancel={actions.startCancel}
            onOpenMedicalRecord={(recordId) => openRecord(recordId)}
          />
        ))}
      </View>
    );
  };

  return (
    <>
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
              onPress={() => setBookingOpen(true)}
              accessibilityRole="button"
              className="rounded-xl bg-mc-primary px-4 py-3 active:opacity-90"
            >
              <Text className="font-semibold text-white">New request</Text>
            </Pressable>
          </View>

          <Text className={`text-sm leading-relaxed ${classes.textMuted}`}>
            Your request joins the mission queue. Date and time appear here after a health worker
            assigns your slot — you can move or cancel it from the card once it is scheduled.
          </Text>

          {body()}

          <AppointmentModal
            visible={bookingOpen}
            onClose={() => setBookingOpen(false)}
            onBooked={() => void refresh()}
          />
        </View>
      </ScrollView>

      <AppointmentDetailSheet
        visible={Boolean(selected)}
        appointment={selected}
        palette={palette}
        onClose={() => setSelected(null)}
        onOpenMedicalRecord={openRecord}
        onReschedule={actions.startReschedule}
        onCancel={actions.startCancel}
        recordLoading={recordViewer.loading}
        recordError={recordViewer.error}
      />

      <ResidentAppointmentOverlays
        rescheduleTarget={actions.rescheduleTarget}
        onRescheduleSuccess={() => void actions.confirmReschedule()}
        onCloseReschedule={actions.closeReschedule}
        cancelTarget={actions.cancelTarget}
        isCancelling={actions.isCancelling}
        cancelError={actions.cancelError}
        onConfirmCancel={(reason) => void actions.confirmCancel(reason)}
        onCloseCancel={actions.closeCancel}
        recordOpen={recordViewer.isOpen}
        record={recordViewer.record}
        recordForm={recordViewer.form}
        recordLoading={recordViewer.loading}
        recordError={recordViewer.error}
        onRetryRecord={recordViewer.retry}
        onCloseRecord={recordViewer.close}
        toast={actions.toast}
        onHideToast={actions.hideToast}
      />
    </>
  );
};

export default ResidentAppointments;
