import { useAuth } from "@/contexts/AuthContext";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import { ClinicalBlock, CompletedBadge, FollowUpBlock, ItemsGivenBlock, VisitBlock } from "@/components/medicalRecord/details/RecordDetailSections";
import { Block, Row } from "@/components/medicalRecord/details/RecordPrimitives";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

import { useVaccinationTabs, VACCINATION_DIALOG_WIDTH } from "./useVaccinationTabs";
import { peopleFromRecord } from "./vaccinationPeople";
import VaccinationRecordPanels from "./VaccinationRecordPanels";
import VaccinationTabBar from "./VaccinationTabBar";

type Props = {
  visible: boolean;
  record: MedicalRecord;
  form: CompletionForm | null;
  onClose: () => void;
  showProviderNotes: boolean;
};

/** An immunization record opened from a queue. The other sections are the ones every record shows. */
const VaccinationRecordDialog = ({ visible, record, form, onClose, showProviderNotes }: Props) => {
  const { user } = useAuth();
  const base = useQueuePalette();
  // Section labels on this clinical record stay readable in both themes.
  const palette = { ...base, subtle: base.body };
  const tabs = useVaccinationTabs(visible ? record._id : null);
  return (
    <CompleteModalShell
      visible={visible}
      onRequestClose={onClose}
      dismissible
      closeLabel="Close medical record"
      title="Medical Record"
      subtitle={form?.label ?? record.serviceType}
      subheader={<VaccinationTabBar tabs={tabs} />}
      scrollToTopKey={tabs.scroll.key}
      scrollToY={tabs.scroll.y}
      maxWidth={VACCINATION_DIALOG_WIDTH}
    >
      <VaccinationRecordPanels
        key={record._id}
        record={record}
        form={form}
        tabs={tabs}
        motherMasterResidentId={record.masterResidentId}
        peopleOf={(checklist) => peopleFromRecord(record, checklist, user?.name ?? "")}
        leading={<CompletedBadge record={record} palette={palette} />}
        trailing={
          <>
            <VisitBlock record={record} form={form} palette={palette} />
            <ClinicalBlock record={record} palette={palette} />
            <ItemsGivenBlock record={record} palette={palette} />
            <FollowUpBlock record={record} palette={palette} />
            {showProviderNotes && record.notes ? (
              <Block title="Provider notes" palette={palette}>
                <Row label="Notes" value={record.notes} palette={palette} />
              </Block>
            ) : null}
          </>
        }
      />
    </CompleteModalShell>
  );
};

export default VaccinationRecordDialog;
