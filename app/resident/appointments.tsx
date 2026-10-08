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
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useSearchParamValue } from "@/hooks/useSearchParamValue";
import type { AppointmentRecord } from "@/services/appointments";

const ResidentAppointments = () => {
  const { classes } = useTheme();
  const { isMobile } = useResponsive();
  const insets = useRoleScreenInsets();
  const palette = useQueuePalette();

  const { appointments, loading, error, refresh, revalidate, applyLocal } = useResidentAppointments();
  const actions = useResidentAppointmentActions(revalidate, applyLocal);
  const recordViewer = useMedicalRecordViewer();

  // `?book=1` is the dashboard's "Book appointment" shortcut.
  const [bookingOpen, setBookingOpen] = useState(useSearchParamValue("book") === "1");
  const [selected, setSelected] = useState<AppointmentRecord | null>(null);
  const openBooking = () => setBookingOpen(true);

  const openRecord = (recordId: string) => {
    setSelected(null);
    void recordViewer.openById(recordId);
  };

  return (
    <>
      <ScrollView
        className={`flex-1 ${classes.scrollBg}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop }}
      >
        <View className="gap-6 pb-4">
          <PageHeader
            title="Appointments"
            subtitle="Book a health visit and keep track of your appointments."
            actions={<Button label="Book appointment" icon="plus" onPress={openBooking} fullWidth={isMobile} />}
          />

          <Text className={`text-sm leading-relaxed ${classes.textMuted}`}>
            Your appointment is confirmed as soon as you book it. Immunization times are assigned first
            come, first served. You can move or cancel any appointment from its card.
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
