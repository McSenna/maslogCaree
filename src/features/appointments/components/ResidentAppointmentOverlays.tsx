import { ResidentMedicalDetailsDialog } from "@/features/medical-records/components/ResidentMedicalDetailsDialog";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";
import type { AppointmentRecord } from "@/types/appointments.types";

import { CancelAppointmentDialog } from "./cancel/CancelAppointmentDialog";
import { RescheduleAppointmentDialog } from "./reschedule/RescheduleAppointmentDialog";

export type ResidentAppointmentOverlaysProps = {
  rescheduleTarget: AppointmentRecord | null;
  onRescheduleSuccess: () => void;
  onCloseReschedule: () => void;

  cancelTarget: AppointmentRecord | null;
  isCancelling: boolean;
  cancelError: string | null;
  onConfirmCancel: (reason: string) => void;
  onCloseCancel: () => void;

  recordOpen: boolean;
  record: MedicalRecord | null;
  recordForm: CompletionForm | null;
  recordLoading: boolean;
  recordError: string | null;
  onRetryRecord: () => void;
  onCloseRecord: () => void;

};

/** Every overlay the resident appointment screens share, in one place. */
const ResidentAppointmentOverlays = ({
  rescheduleTarget,
  onRescheduleSuccess,
  onCloseReschedule,
  cancelTarget,
  isCancelling,
  cancelError,
  onConfirmCancel,
  onCloseCancel,
  recordOpen,
  record,
  recordForm,
  recordLoading,
  recordError,
  onRetryRecord,
  onCloseRecord,
}: ResidentAppointmentOverlaysProps) => (
  <>
    <RescheduleAppointmentDialog
      visible={Boolean(rescheduleTarget)}
      appointment={rescheduleTarget}
      onSuccess={onRescheduleSuccess}
      onClose={onCloseReschedule}
    />

    <CancelAppointmentDialog
      visible={Boolean(cancelTarget)}
      appointment={cancelTarget}
      isSubmitting={isCancelling}
      error={cancelError}
      onConfirm={onConfirmCancel}
      onClose={onCloseCancel}
    />

    <ResidentMedicalDetailsDialog
      visible={recordOpen}
      record={record}
      form={recordForm}
      loading={recordLoading}
      error={recordError}
      onRetry={onRetryRecord}
      onClose={onCloseRecord}
    />

  </>
);

export default ResidentAppointmentOverlays;
