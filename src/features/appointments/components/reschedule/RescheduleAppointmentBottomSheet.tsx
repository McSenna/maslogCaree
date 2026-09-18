import { DialogSheetShell } from "@/components/ui/dialog/DialogShells";
import type { AppointmentRecord } from "@/types/appointments.types";

import { RescheduleAppointmentForm } from "./RescheduleAppointmentForm";

export type RescheduleAppointmentBottomSheetProps = {
  visible: boolean;
  appointment: AppointmentRecord | null;
  onSuccess: (appointment: AppointmentRecord) => void;
  onClose: () => void;
};

export const RescheduleAppointmentBottomSheet = ({
  visible,
  appointment,
  onSuccess,
  onClose,
}: RescheduleAppointmentBottomSheetProps) => {
  if (!visible || !appointment) return null;

  return (
    <DialogSheetShell visible title="Reschedule Appointment" icon="calendar" onClose={onClose}>
      <RescheduleAppointmentForm
        appointment={appointment}
        onSuccess={onSuccess}
        onCancel={onClose}
      />
    </DialogSheetShell>
  );
};

export default RescheduleAppointmentBottomSheet;
