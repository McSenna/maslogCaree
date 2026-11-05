import { useMemo } from "react";
import { View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { CompletionPlaceholder } from "@/components/medicalRecord/complete/CompletionChrome";
import { buildDetailGroups, buildFollowUp } from "@/components/medicalRecord/history/recordDetailGroups";
import { getServiceLabel } from "@/config/appointmentServices";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { VaccinationTabsState } from "@/features/immunization/recordView/useVaccinationTabs";
import { isImmunizationRecord } from "@/features/immunization/recordView/vaccinationScope";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";
import type { AppointmentRecord } from "@/types/appointments.types";

import ResidentImmunizationRecord from "./ResidentImmunizationRecord";
import { ClinicalFacts, DetailGroups, FollowUpFacts, ItemsGivenFacts, VisitFacts } from "./ResidentRecordSections";

const NOT_FILED = "No medical details are available yet. They appear here once your health worker files the record for this visit.";

export type ResidentMedicalDetailsViewProps = {
  record: MedicalRecord | null;
  form?: CompletionForm | null;
  loading?: boolean;
  error?: string | null;
  appointment?: AppointmentRecord | null;
  onRetry?: () => void;
  /** Immunization records only: the tab state, which lives with the dialog's pinned tab bar. */
  vaccinationTabs?: VaccinationTabsState;
  /** Closes the dialog before a shortcut leaves it. */
  onLeave?: () => void;
};

/** One record for its owner: the staff view's blocks, without the care team's notes or its edit history. */
export const ResidentMedicalDetailsView = ({
  record,
  form = null,
  loading = false,
  error = null,
  appointment = null,
  onRetry,
  vaccinationTabs,
  onLeave,
}: ResidentMedicalDetailsViewProps) => {
  const palette = useAdminSurfacePalette();
  const groups = useMemo(() => (record ? buildDetailGroups(record, form) : []), [record, form]);
  const followUp = useMemo(() => (record ? buildFollowUp(record, form) : null), [record, form]);

  if (loading) return <CompletionPlaceholder message="Loading the medical record." />;
  if (error) {
    return (
      <View className="items-center gap-3">
        <CompletionPlaceholder message={error} error />
        {onRetry ? <DashboardButton palette={palette} variant="secondary" icon="refresh-cw" label="Try again" onPress={onRetry} /> : null}
      </View>
    );
  }
  if (!record) return <CompletionPlaceholder message={NOT_FILED} />;

  const serviceKey = record.serviceType || appointment?.consultationType || "";
  const serviceLabel = getServiceLabel(serviceKey) || serviceKey;

  if (isImmunizationRecord(record) && vaccinationTabs) {
    return (
      <ResidentImmunizationRecord
        key={record._id}
        record={record}
        form={form}
        serviceLabel={serviceLabel}
        followUp={followUp}
        tabs={vaccinationTabs}
        onLeave={onLeave}
      />
    );
  }

  return (
    <View className="w-full gap-4">
      <VisitFacts record={record} serviceLabel={serviceLabel} appointment={appointment} />
      <DetailGroups groups={groups} />
      <ClinicalFacts record={record} />
      <ItemsGivenFacts record={record} />
      <FollowUpFacts followUp={followUp} />
    </View>
  );
};

export default ResidentMedicalDetailsView;
