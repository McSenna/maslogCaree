import { useDialogPresentation } from "@/hooks/useDialogPresentation";
import type { AppointmentRecord } from "@/types/appointments.types";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";
import { ResidentMedicalDetailsBottomSheet } from "./ResidentMedicalDetailsBottomSheet";
import { ResidentMedicalDetailsModal } from "./ResidentMedicalDetailsModal";

export type ResidentMedicalDetailsDialogProps = {
  visible: boolean;
  record: MedicalRecord | null;
  form?: CompletionForm | null;
  loading?: boolean;
  error?: string | null;
  appointment?: AppointmentRecord | null;
  onClose: () => void;
  onRetry?: () => void;
};

export const ResidentMedicalDetailsDialog = (props: ResidentMedicalDetailsDialogProps) => {
  const presentation = useDialogPresentation();

  return presentation === "modal" ? (
    <ResidentMedicalDetailsModal {...props} />
  ) : (
    <ResidentMedicalDetailsBottomSheet {...props} />
  );
};

export default ResidentMedicalDetailsDialog;
