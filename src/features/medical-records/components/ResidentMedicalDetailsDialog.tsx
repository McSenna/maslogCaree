import { getServiceLabel } from "@/config/appointmentServices";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import { useVaccinationTabs, VACCINATION_DIALOG_WIDTH } from "@/features/immunization/recordView/useVaccinationTabs";
import { isImmunizationRecord } from "@/features/immunization/recordView/vaccinationScope";
import VaccinationTabBar from "@/features/immunization/recordView/VaccinationTabBar";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";
import type { AppointmentRecord } from "@/types/appointments.types";

import { babyNameOf } from "../residentRecordRows";
import { ResidentMedicalDetailsView } from "./ResidentMedicalDetailsView";

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

const subtitleOf = (record: MedicalRecord | null) => {
  if (!record) return undefined;
  const service = getServiceLabel(record.serviceType) || record.serviceType;
  const baby = babyNameOf(record);
  return baby ? `${baby}, ${service}` : service;
};

/** The shell staff records open in: centred on wide screens, a bottom sheet on phones. Read only. */
export const ResidentMedicalDetailsDialog = ({ visible, onClose, ...view }: ResidentMedicalDetailsDialogProps) => {
  const { record } = view;
  const tabs = useVaccinationTabs(visible ? (record?._id ?? null) : null);
  const vaccination = isImmunizationRecord(record);

  return (
    <CompleteModalShell
      visible={visible}
      onRequestClose={onClose}
      dismissible
      closeLabel="Close the medical record"
      title="Medical record"
      subtitle={subtitleOf(record)}
      subheader={vaccination ? <VaccinationTabBar tabs={tabs} /> : undefined}
      scrollToTopKey={vaccination ? tabs.scroll.key : undefined}
      scrollToY={tabs.scroll.y}
      maxWidth={vaccination ? VACCINATION_DIALOG_WIDTH : undefined}
    >
      <ResidentMedicalDetailsView {...view} vaccinationTabs={vaccination ? tabs : undefined} onLeave={onClose} />
    </CompleteModalShell>
  );
};

export default ResidentMedicalDetailsDialog;
