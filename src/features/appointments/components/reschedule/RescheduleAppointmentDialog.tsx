import { useDialogPresentation } from "@/hooks/useDialogPresentation";
import type { AppointmentRecord } from "@/types/appointments.types";
import { RescheduleAppointmentBottomSheet } from "./RescheduleAppointmentBottomSheet";
import { RescheduleAppointmentModal } from "./RescheduleAppointmentModal";

export type RescheduleAppointmentDialogProps = {
  visible: boolean;
  appointment: AppointmentRecord | null;
  onSuccess: (appointment: AppointmentRecord) => void;
  onClose: () => void;
};

export const RescheduleAppointmentDialog = (props: RescheduleAppointmentDialogProps) => {
  const presentation = useDialogPresentation();

  return presentation === "modal" ? (
    <RescheduleAppointmentModal {...props} />
  ) : (
    <RescheduleAppointmentBottomSheet {...props} />
  );
};

export default RescheduleAppointmentDialog;
