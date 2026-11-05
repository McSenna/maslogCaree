import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { Block, Row, formatWhen } from "@/components/medicalRecord/details/RecordPrimitives";
import { ItemsGivenBlock } from "@/components/medicalRecord/details/RecordDetailSections";
import type { DetailGroup, FollowUp } from "@/components/medicalRecord/history/recordDetailGroups";
import { formatCalendarDay, formatVisitDate, recordReference } from "@/features/medicalRecordMasterlist/masterlistLabels";
import { immunizationProgressLabel } from "@/services/immunizationRecordProgress";
import type { MedicalRecord } from "@/services/medicalRecords";
import { isEncodedRecord } from "@/services/medicalRecordTypes";
import type { AppointmentRecord } from "@/types/appointments.types";

import { babyNameOf, providerLineOf, sourceLabelOf } from "../residentRecordRows";

// A finished visit and a finished program are different facts, so they read differently.
const statusOf = (record: MedicalRecord): string => {
  const progress = immunizationProgressLabel(record);
  if (progress) return progress;
  if (record.serviceDetails?.ledgerSummary) return "Visit completed";
  // A paper record's source already says what it is.
  return isEncodedRecord(record) ? "" : "Completed";
};

const visitedAtOf = (record: MedicalRecord, appointment: AppointmentRecord | null) => {
  const linked = typeof record.appointment === "object" ? record.appointment : appointment;
  return record.appointmentDate ?? linked?.slotStart ?? null;
};

type VisitProps = { record: MedicalRecord; serviceLabel: string; appointment?: AppointmentRecord | null };

/** The facts staff see in their Visit block. A paper record has a day but no time. */
export const VisitFacts = ({ record, serviceLabel, appointment = null }: VisitProps) => {
  const palette = useQueuePalette();
  const encoded = isEncodedRecord(record);
  const visitedAt = encoded ? null : visitedAtOf(record, appointment);
  const baby = babyNameOf(record);
  const status = statusOf(record);

  return (
    <Block title="Visit" palette={palette}>
      <Row label="Reference" value={recordReference(record._id)} palette={palette} />
      {baby ? <Row label="Baby" value={baby} palette={palette} /> : null}
      <Row
        label={encoded ? "Visit date" : baby ? "Record date" : "Recorded"}
        value={encoded ? formatVisitDate(record.source ?? "appointment", record.completedAt) : formatWhen(record.completedAt)}
        palette={palette}
      />
      {visitedAt ? <Row label="Visit date" value={formatWhen(visitedAt)} palette={palette} /> : null}
      <Row label="Service" value={serviceLabel} palette={palette} />
      {status ? <Row label="Status" value={status} palette={palette} /> : null}
      <Row label="Source" value={sourceLabelOf(record)} palette={palette} />
      <Row label="Provider" value={providerLineOf(record)} palette={palette} />
      {record.visitReason ? <Row label="Reason for visit" value={record.visitReason} palette={palette} /> : null}
    </Block>
  );
};

/** Vital signs and the service's own fields, each group as its own block. */
export const DetailGroups = ({ groups }: { groups: DetailGroup[] }) => {
  const palette = useQueuePalette();
  return (
    <>
      {groups.map((group) => (
        <Block key={group.title} title={group.title} palette={palette}>
          {group.entries.map((entry) => (
            <Row key={entry.key} label={entry.label} value={entry.value} palette={palette} />
          ))}
        </Block>
      ))}
    </>
  );
};

/** Only what was written. Staff also see empty rows, since they may need to fill them in. */
export const ClinicalFacts = ({ record }: { record: MedicalRecord }) => {
  const palette = useQueuePalette();
  const rows = [
    { label: "Diagnosis", value: record.diagnosis },
    { label: "Assessment", value: record.assessment },
    { label: "Findings", value: record.findings },
    { label: "Recommendations", value: record.recommendations },
  ].filter((row) => row.value);
  if (rows.length === 0) return null;

  return (
    <Block title="Clinical" palette={palette}>
      {rows.map((row) => (
        <Row key={row.label} label={row.label} value={row.value ?? ""} palette={palette} />
      ))}
    </Block>
  );
};

export const FollowUpFacts = ({ followUp }: { followUp: FollowUp | null }) => {
  const palette = useQueuePalette();
  if (!followUp) return null;

  return (
    <Block title="Follow-up" palette={palette}>
      <Row label={followUp.dateLabel} value={followUp.date ? formatCalendarDay(followUp.date) : "To be advised"} palette={palette} />
      {followUp.instructions ? <Row label="Instructions" value={followUp.instructions} palette={palette} /> : null}
    </Block>
  );
};

export const ItemsGivenFacts = ({ record }: { record: MedicalRecord }) => {
  const palette = useQueuePalette();
  return <ItemsGivenBlock record={record} palette={palette} />;
};
