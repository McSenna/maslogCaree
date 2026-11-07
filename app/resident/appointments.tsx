import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import Button from "@/components/buttons/Button";
import { FAB_CONTENT_CLEARANCE } from "@/components/buttons/FloatingActionButton";
import { useFloatingAction } from "@/components/layout/floatingAction/FloatingActionContext";
import PageHeader from "@/components/layout/PageHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { takeAppointmentDetailRequest } from "@/features/appointments/appointmentDetailRequest";
import AppointmentDetailSheet from "@/features/appointments/components/AppointmentDetailSheet";
import AppointmentModal from "@/features/appointments/components/AppointmentModal";
import ResidentAppointmentList from "@/features/appointments/components/ResidentAppointmentList";
import ResidentAppointmentOverlays from "@/features/appointments/components/ResidentAppointmentOverlays";
import { findWaitingDoctorRequest } from "@/features/appointments/hooks/booking/waitingRequest";
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

  const { appointments, loading, error, refresh, revalidate, applyLocal } =
    useResidentAppointments();
  const actions = useResidentAppointmentActions(revalidate, applyLocal);
  const recordViewer = useMedicalRecordViewer();
  const waitingRequest = useMemo(
    () => findWaitingDoctorRequest(appointments),
    [appointments],
  );

  // `?book=1` is the dashboard's "Book appointment" shortcut.
  const [bookingOpen, setBookingOpen] = useState(
    useSearchParamValue("book") === "1",
  );
  const [selected, setSelected] = useState<AppointmentRecord | null>(null);
  const openBooking = () => setBookingOpen(true);
  // Phones get the floating button; tablet and desktop keep the header button.
  // With no appointments the empty state's own button is the one control.
  const showsEmptyState = !loading && !error && appointments.length === 0;
  const showFab = isMobile && !showsEmptyState;
  // RoleLayout draws it beside the bottom navigation, so screen transitions never move it.
  useFloatingAction(
    showFab ? { icon: "plus", label: "Book an appointment", onPress: openBooking } : null,
  );

  // The dashboard's "View details" names one appointment; open it once the list has it.
  const requestedId = useRef(takeAppointmentDetailRequest());
  useEffect(() => {
    if (!requestedId.current || loading) return;
    const requested = appointments.find(
      (appointment) => appointment._id === requestedId.current,
    );
    requestedId.current = null;
    if (requested) setSelected(requested);
  }, [appointments, loading]);

  const openRecord = (recordId: string) => {
    setSelected(null);
    void recordViewer.openById(recordId);
  };

  return (
    <>
      <ScrollView
        className={`flex-1 ${classes.scrollBg}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: showFab ? FAB_CONTENT_CLEARANCE : 0,
        }}
      >
        <View className="gap-6 pb-4">
          <PageHeader
            title="Appointments"
            hideHeading
            actions={
              isMobile ? undefined : (
                <Button
                  label="Book appointment"
                  icon="plus"
                  onPress={openBooking}
                />
              )
            }
          />

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
            waitingRequest={waitingRequest}
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
