import { DialogSheetShell } from "@/components/ui/dialog/DialogShells";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";

import { CancelAppointmentForm } from "./CancelAppointmentForm";

export type CancelAppointmentBottomSheetProps = {
  visible: boolean;
  appointment: AppointmentRecord | null;
  isSubmitting: boolean;
  error?: string | null;
  onConfirm: (reason: string) => void;
  onClose: () => void;
};

export const CancelAppointmentBottomSheet = ({
  visible,
  appointment,
  isSubmitting,
  error = null,
  onConfirm,
  onClose,
}: CancelAppointmentBottomSheetProps) => {
  const palette = useResidentDialogPalette();

  if (!visible || !appointment) return null;

  return (
    <DialogSheetShell
      visible
      title="Cancel Appointment"
      icon="x-circle"
      tint={palette.danger}
      tintSoft={palette.dangerSoft}
      onClose={onClose}
    >
      <CancelAppointmentForm
        appointment={appointment}
        isSubmitting={isSubmitting}
        error={error}
        onConfirm={onConfirm}
        onCancel={onClose}
      />
    </DialogSheetShell>
  );
};

export default CancelAppointmentBottomSheet;
