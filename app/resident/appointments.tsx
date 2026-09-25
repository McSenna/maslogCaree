import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import Button from "@/components/buttons/Button";
import PageHeader from "@/components/layout/PageHeader";
import { useTheme } from "@/contexts/ThemeContext";
import AppointmentDetailSheet from "@/features/appointments/components/AppointmentDetailSheet";
import AppointmentModal from "@/features/appointments/components/AppointmentModal";
import ResidentAppointmentList from "@/features/appointments/components/ResidentAppointmentList";
import ResidentAppointmentOverlays from "@/features/appointments/components/ResidentAppointmentOverlays";
import { useResidentAppointmentActions } from "@/features/appointments/hooks/useResidentAppointmentActions";
import { useMedicalRecordViewer } from "@/hooks/useMedicalRecordViewer";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { useResponsive } from "@/hooks/useResponsive";
import type { AppointmentRecord } from "@/services/appointments";

const ResidentAppointments = () => {
  const { classes } = useTheme();
  const { isMobile } = useResponsive();
  const palette = useQueuePalette();

  const { appointments, loading, error, refresh, revalidate } = useResidentAppointments();
  const actions = useResidentAppointmentActions(revalidate);
  const recordViewer = useMedicalRecordViewer();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selected, setSelected] = useState<AppointmentRecord | null>(null);
  const openBooking = () => setBookingOpen(true);

  const openRecord = (recordId: string) => {
    setSelected(null);
    void recordViewer.openById(recordId);
  };

  return (
    <>
      <ScrollView className={`flex-1 ${classes.scrollBg}`} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-4">
          <PageHeader
            title="Appointments"
            subtitle="Request a mission visit and track scheduling from your health team."
            actions={<Button label="New request" icon="plus" onPress={openBooking} fullWidth={isMobile} />}
          />

          <Text className={`text-sm leading-relaxed ${classes.textMuted}`}>
            Your request joins the mission queue. Date and time appear here after a health worker
            assigns your slot — you can move or cancel it from the card once it is scheduled.
          </Text>

          <ResidentAppointmentList
            appointments={appointments}
            loading={loading}
            error={error}
            onRetry={() => void refresh()}
            onBook={openBooking}
            onOpen={setSelected}
            onReschedule={actions.startReschedule}
            onCancel={actions.startCancel}
            onOpenMedicalRecord={openRecord}
          />

          <AppointmentModal
            visible={bookingOpen}
            onClose={() => setBookingOpen(false)}
            onBooked={() => void revalidate()}
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
      />
    </>
  );
};

export default ResidentAppointments;
