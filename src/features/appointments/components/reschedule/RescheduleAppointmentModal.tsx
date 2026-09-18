import { DialogModalShell } from "@/components/ui/dialog/DialogShells";
import type { AppointmentRecord } from "@/types/appointments.types";

import { RescheduleAppointmentForm } from "./RescheduleAppointmentForm";

export type RescheduleAppointmentModalProps = {
  visible: boolean;
  appointment: AppointmentRecord | null;
  onSuccess: (appointment: AppointmentRecord) => void;
  onClose: () => void;
};

export const RescheduleAppointmentModal = ({
  visible,
  appointment,
  onSuccess,
  onClose,
}: RescheduleAppointmentModalProps) => {
  if (!visible || !appointment) return null;

  return (
    <DialogModalShell
      visible
      title="Reschedule Appointment"
      icon="calendar"
      onClose={onClose}
      maxWidth={520}
    >
      <RescheduleAppointmentForm
        appointment={appointment}
        onSuccess={onSuccess}
        onCancel={onClose}
      />
    </DialogModalShell>
  );
};

export default RescheduleAppointmentModal;
