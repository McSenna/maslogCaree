import { useMemo } from "react";
import { ScrollView } from "react-native";

import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import Timeline from "@/components/ui/Timeline";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import type { AppointmentRecord } from "@/services/appointments";
import { getAssignedStaffName } from "@/utils/appointmentDisplay";

import {
  appointmentReference,
  appointmentServiceLabel,
  appointmentWhen,
  buildAppointmentTimeline,
  medicalRecordIdOf,
  residentStatusLabel,
  statusToneKey,
} from "../appointmentPresenter";
import AppointmentSheetActions from "./detailSheet/AppointmentSheetActions";
import AppointmentSheetHeader from "./detailSheet/AppointmentSheetHeader";
import {
  AppointmentDetailRows,
  DeclineReasonSection,
  ResidentNotesSection,
} from "./detailSheet/AppointmentSheetSections";
import MedicalRecordLink from "./detailSheet/MedicalRecordLink";

const AppointmentDetailSheet = ({
  visible,
  appointment,
  palette,
  onClose,
  onOpenMedicalRecord,
  onReschedule,
  onCancel,
  recordLoading = false,
  recordError,
}: {
  visible: boolean;
  appointment: AppointmentRecord | null;
  palette: QueuePalette;
  onClose: () => void;
  onOpenMedicalRecord: (recordId: string) => void;
  onReschedule?: (appointment: AppointmentRecord) => void;
  onCancel?: (appointment: AppointmentRecord) => void;
  recordLoading?: boolean;
  recordError?: string | null;
}) => {
  const steps = useMemo(
    () => (appointment ? buildAppointmentTimeline(appointment) : []),
    [appointment]
  );

  if (!appointment) return null;

  const visual = resolveVisual(getServiceVisual(appointment.consultationType), palette.isDark);
  const service = appointmentServiceLabel(appointment);
  const status = residentStatusLabel(appointment.status);
  const tone = palette.statuses[statusToneKey(appointment.status)];
  const recordId = medicalRecordIdOf(appointment);

  const rows = [
    { label: "Reference no.", value: appointmentReference(appointment) },
    { label: "Service", value: service },
    { label: "Scheduled", value: appointment.slotStart ? appointmentWhen(appointment) : "" },
    { label: "Seen by", value: getAssignedStaffName(appointment.completedBy) },
    { label: "Scheduled by", value: getAssignedStaffName(appointment.assignedBy) },
    { label: "Provider requested", value: appointment.preferredProvider?.fullname ?? "" },
  ].filter((row) => row.value);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={(requestClose) => (
        <AppointmentSheetHeader
          visual={visual}
          service={service}
          status={status}
          tone={tone}
          when={appointmentWhen(appointment)}
          palette={palette}
          onRequestClose={requestClose}
        />
      )}
      accessibilityLabel={`${service} appointment details`}
      surface={palette.panelBg}
      handleColor={palette.divider}
      scrim={palette.isDark ? "rgba(2,6,23,0.6)" : "rgba(15,37,87,0.35)"}
    >
      <ScrollView
        className="flex-1"
        style={SHEET_SCROLL_STYLE}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
          gap: 16,
        }}
      >
        <AppointmentSheetActions
          appointment={appointment}
          palette={palette}
          onReschedule={
            onReschedule &&
            ((item) => {
              onClose();
              onReschedule(item);
            })
          }
          onCancel={
            onCancel &&
            ((item) => {
              onClose();
              onCancel(item);
            })
          }
        />

        <AppointmentDetailRows rows={rows} palette={palette} />
        <ResidentNotesSection appointment={appointment} palette={palette} />
        <DeclineReasonSection appointment={appointment} palette={palette} />

        <MedicalRecordLink
          recordId={recordId}
          palette={palette}
          loading={recordLoading}
          error={recordError}
          onPress={onOpenMedicalRecord}
        />

        <Timeline
          title="Appointment Timeline"
          steps={steps}
          palette={palette}
          undatedText="Not yet"
        />
      </ScrollView>
    </BottomSheet>
  );
};

export default AppointmentDetailSheet;
