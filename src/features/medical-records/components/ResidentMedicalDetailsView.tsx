import { useMemo } from "react";
import { View } from "react-native";

import {
  buildDetailGroups,
  buildFollowUp,
} from "@/components/medicalRecord/history/recordDetailGroups";
import { getServiceLabel } from "@/config/appointmentServices";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";
import type { AppointmentRecord } from "@/types/appointments.types";

import { AppointmentInfoSection } from "./sections/AppointmentInfoSection";
import {
  AssessmentSection,
  RecommendationsSection,
} from "./sections/AssessmentSections";
import { DetailSection, KeyValueRow } from "./sections/DetailSection";
import { ItemsGivenSection } from "./sections/ItemsGivenSection";
import {
  DetailsEmpty,
  DetailsError,
  DetailsLoading,
} from "./sections/MedicalDetailsStates";
import { MedicalRecordSummary } from "./sections/MedicalRecordSummary";
import { VitalSignsGrid } from "./sections/VitalSignsGrid";

export type ResidentMedicalDetailsViewProps = {
  record: MedicalRecord | null;
  form?: CompletionForm | null;
  loading?: boolean;
  error?: string | null;
  appointment?: AppointmentRecord | null;
  onRetry?: () => void;
};

export const ResidentMedicalDetailsView = ({
  record,
  form = null,
  loading = false,
  error = null,
  appointment = null,
  onRetry,
}: ResidentMedicalDetailsViewProps) => {
  const palette = useResidentDialogPalette();

  const groups = useMemo(
    () => (record ? buildDetailGroups(record, form) : []),
    [record, form]
  );
  const followUp = useMemo(
    () => (record ? buildFollowUp(record, form) : null),
    [record, form]
  );

  if (loading) return <DetailsLoading palette={palette} />;
  if (error) return <DetailsError palette={palette} message={error} onRetry={onRetry} />;
  if (!record) return <DetailsEmpty palette={palette} />;

  const vitalsGroup = groups.find((group) => group.isVitals);
  const otherGroups = groups.filter((group) => group !== vitalsGroup);

  const serviceKey = record.serviceType || appointment?.consultationType || "";
  const serviceLabel = getServiceLabel(serviceKey) || serviceKey;

  return (
    <View style={{ gap: 16 }}>
      <MedicalRecordSummary palette={palette} record={record} serviceLabel={serviceLabel} />

      <AppointmentInfoSection
        palette={palette}
        record={record}
        serviceLabel={serviceLabel}
        appointment={appointment}
      />

      <VitalSignsGrid palette={palette} entries={vitalsGroup?.entries ?? []} />

      {otherGroups.map((group) => (
        <DetailSection key={group.title} palette={palette} title={group.title} icon="file-text">
          <View style={{ gap: 8 }}>
            {group.entries.map((entry) => (
              <KeyValueRow
                key={entry.key}
                palette={palette}
                label={entry.label}
                value={entry.value}
              />
            ))}
          </View>
        </DetailSection>
      ))}

      <AssessmentSection palette={palette} record={record} />

      <RecommendationsSection palette={palette} record={record} followUp={followUp} />

      <ItemsGivenSection palette={palette} items={record.itemsGiven ?? []} />
    </View>
  );
};

export default ResidentMedicalDetailsView;
