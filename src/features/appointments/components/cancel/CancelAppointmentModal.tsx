import { DialogModalShell } from "@/components/ui/dialog/DialogShells";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";

import { CancelAppointmentForm } from "./CancelAppointmentForm";

export type CancelAppointmentModalProps = {
  visible: boolean;
  appointment: AppointmentRecord | null;
  isSubmitting: boolean;
  error?: string | null;
  onConfirm: (reason: string) => void;
  onClose: () => void;
};

export const CancelAppointmentModal = ({
  visible,
  appointment,
  isSubmitting,
  error = null,
  onConfirm,
  onClose,
}: CancelAppointmentModalProps) => {
  const palette = useResidentDialogPalette();

  if (!visible || !appointment) return null;

  return (
    <DialogModalShell
      visible
      title="Cancel Appointment"
      icon="x-circle"
      tint={palette.danger}
      tintSoft={palette.dangerSoft}
      onClose={onClose}
      maxWidth={500}
    >
      <CancelAppointmentForm
        appointment={appointment}
        isSubmitting={isSubmitting}
        error={error}
        onConfirm={onConfirm}
        onCancel={onClose}
      />
    </DialogModalShell>
  );
};

export default CancelAppointmentModal;
