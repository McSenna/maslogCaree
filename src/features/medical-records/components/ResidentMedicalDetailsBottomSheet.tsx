import { DialogSheetShell } from "@/components/ui/dialog/DialogShells";
import type { AppointmentRecord } from "@/types/appointments.types";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

import { ResidentMedicalDetailsView } from "./ResidentMedicalDetailsView";

export type ResidentMedicalDetailsBottomSheetProps = {
  visible: boolean;
  record: MedicalRecord | null;
  form?: CompletionForm | null;
  loading?: boolean;
  error?: string | null;
  appointment?: AppointmentRecord | null;
  onClose: () => void;
  onRetry?: () => void;
};

export const ResidentMedicalDetailsBottomSheet = ({
  visible,
  onClose,
  ...rest
}: ResidentMedicalDetailsBottomSheetProps) => {
  if (!visible) return null;

  return (
    <DialogSheetShell visible title="Medical Details" icon="activity" onClose={onClose}>
      <ResidentMedicalDetailsView {...rest} />
    </DialogSheetShell>
  );
};

export default ResidentMedicalDetailsBottomSheet;
