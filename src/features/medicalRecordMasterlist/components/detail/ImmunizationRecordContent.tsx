import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { ClinicalBlock, FollowUpBlock, ItemsGivenBlock } from "@/components/medicalRecord/details/RecordDetailSections";
import { Block, Row } from "@/components/medicalRecord/details/RecordPrimitives";
import type { VaccinationTabsState } from "@/features/immunization/recordView/useVaccinationTabs";
import { babyIdOf } from "@/features/immunization/recordView/vaccinationScope";
import { peopleFromMasterlist } from "@/features/immunization/recordView/vaccinationPeople";
import VaccinationRecordPanels from "@/features/immunization/recordView/VaccinationRecordPanels";

import { formatVisitDate, recordReference, SOURCE_LABELS } from "../../masterlistLabels";
import type { MasterlistDetail } from "../../types";
import { providerOf } from "../rowText";
import RecordHistoryBlock from "./RecordHistoryBlock";

type Props = {
  detail: MasterlistDetail;
  tabs: VaccinationTabsState;
  onShowHistory?: () => void;
  /** The midwife's way into this baby's checklist. */
  onOpenChecklist?: () => void;
  /** The same, from a visit record: it opens the baby's program record. */
  onOpenProgram?: (programRecordId: string) => void;
};

/** A staff member's immunization record: the same data as any record, with vaccinations as tabs. */
const ImmunizationRecordContent = ({ detail, tabs, onShowHistory, onOpenChecklist, onOpenProgram }: Props) => {
  const palette = useQueuePalette();
  const { record } = detail;
  // A baby's program record is a summary derived from its doses. A single-visit record's
  // findings and follow-up exist nowhere else, so those sections stay.
  const onBabyLedger = babyIdOf(record) !== null;
  return (
    <VaccinationRecordPanels
      record={record}
      form={detail.form}
      tabs={tabs}
      motherMasterResidentId={detail.resident.masterResidentId}
      peopleOf={(checklist) => peopleFromMasterlist(detail, checklist)}
      parentShortcuts={onShowHistory && detail.resident.masterResidentId ? [{ label: "View all records", accessibilityLabel: "View all records for this resident", icon: "list", onPress: onShowHistory }] : []}
      babyShortcutsOf={(checklist) => {
        const programId = checklist?.medicalRecord?._id;
        const open = onOpenChecklist ?? (onOpenProgram && programId ? () => onOpenProgram(programId) : undefined);
        return open ? [{ label: "Open baby checklist", icon: "check-square", onPress: open }] : [];
      }}
      trailing={
        <>
          {onBabyLedger ? null : (
            <>
              <Block title="Record" palette={palette}>
                <Row label="Reference" value={recordReference(detail._id)} palette={palette} />
                <Row label="Visit date" value={formatVisitDate(detail.source, detail.visitDate)} palette={palette} />
                <Row label="Service" value={detail.serviceLabel} palette={palette} />
                <Row label="Source" value={SOURCE_LABELS[detail.source]} palette={palette} />
                <Row label="Provider" value={providerOf(detail)} palette={palette} />
                {record.visitReason ? <Row label="Reason for visit" value={record.visitReason} palette={palette} /> : null}
              </Block>
              <ClinicalBlock record={record} palette={palette} />
            </>
          )}
          {record.notes ? (
            <Block title="Care team notes" palette={palette}>
              <Row label="Not shown to the resident" value={record.notes} palette={palette} />
            </Block>
          ) : null}
          <ItemsGivenBlock record={record} palette={palette} />
          {onBabyLedger ? null : (
            <>
              <FollowUpBlock record={record} palette={palette} />
              <RecordHistoryBlock detail={detail} />
            </>
          )}
        </>
      }
    />
  );
};

export default ImmunizationRecordContent;
