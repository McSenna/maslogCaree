import { useDialogPresentation } from "@/hooks/useDialogPresentation";
import type { AppointmentRecord } from "@/types/appointments.types";
import { CancelAppointmentBottomSheet } from "./CancelAppointmentBottomSheet";
import { CancelAppointmentModal } from "./CancelAppointmentModal";

export type CancelAppointmentDialogProps = {
  visible: boolean;
  appointment: AppointmentRecord | null;
  isSubmitting: boolean;
  error?: string | null;
  onConfirm: (reason: string) => void;
  onClose: () => void;
};

export const CancelAppointmentDialog = (props: CancelAppointmentDialogProps) => {
  const presentation = useDialogPresentation();

  return presentation === "modal" ? (
    <CancelAppointmentModal {...props} />
  ) : (
    <CancelAppointmentBottomSheet {...props} />
  );
};

export default CancelAppointmentDialog;
