import { DialogModalShell } from "@/components/ui/dialog/DialogShells";
import type { AppointmentRecord } from "@/types/appointments.types";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

import { ResidentMedicalDetailsView } from "./ResidentMedicalDetailsView";

export type ResidentMedicalDetailsModalProps = {
  visible: boolean;
  record: MedicalRecord | null;
  form?: CompletionForm | null;
  loading?: boolean;
  error?: string | null;
  appointment?: AppointmentRecord | null;
  onClose: () => void;
  onRetry?: () => void;
};

export const ResidentMedicalDetailsModal = ({
  visible,
  onClose,
  ...rest
}: ResidentMedicalDetailsModalProps) => {
  if (!visible) return null;

  return (
    <DialogModalShell
      visible
      title="Medical Details"
      icon="activity"
      onClose={onClose}
      maxWidth={640}
    >
      <ResidentMedicalDetailsView {...rest} />
    </DialogModalShell>
  );
};

export default ResidentMedicalDetailsModal;
