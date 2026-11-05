import { useRouter } from "expo-router";
import { Text } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { Block } from "@/components/medicalRecord/details/RecordPrimitives";
import { useAuth } from "@/contexts/AuthContext";
import ReminderPreference from "@/features/immunization/components/ReminderPreference";
import useImmunizationStyles from "@/features/immunization/components/immunizationStyles";
import type { FollowUp } from "@/components/medicalRecord/history/recordDetailGroups";
import type { VaccinationTabsState } from "@/features/immunization/recordView/useVaccinationTabs";
import { babyIdOf, isLedgerVisit, withoutGeneratedProgress } from "@/features/immunization/recordView/vaccinationScope";
import { peopleFromRecord } from "@/features/immunization/recordView/vaccinationPeople";
import VaccinationRecordPanels from "@/features/immunization/recordView/VaccinationRecordPanels";
import { openImmunizationBaby } from "@/features/immunization/selection";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

import { ClinicalFacts, FollowUpFacts, ItemsGivenFacts, VisitFacts } from "./ResidentRecordSections";

type Props = {
  record: MedicalRecord;
  form: CompletionForm | null;
  serviceLabel: string;
  followUp: FollowUp | null;
  tabs: VaccinationTabsState;
  onLeave?: () => void;
};

const RECORDS_ROUTE = "/resident/medical-records";

/** A resident's immunization record, laid out like the staff one. Shortcuts close the dialog first, like a notification tap. */
const ResidentImmunizationRecord = ({ record, form, serviceLabel, followUp, tabs, onLeave }: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const palette = useQueuePalette();
  const { styles } = useImmunizationStyles();
  const onBabyLedger = babyIdOf(record) !== null;

  const openRecords = () => {
    onLeave?.();
    router.navigate(RECORDS_ROUTE);
  };
  // A visit record leads to its baby's own record, which the records page opens.
  const openBaby = (babyId: string) => {
    openImmunizationBaby(babyId);
    openRecords();
  };
  const openProfile = () => {
    onLeave?.();
    router.push("/resident/profile");
  };

  return (
    <VaccinationRecordPanels
      record={record}
      form={form}
      tabs={tabs}
      peopleOf={(checklist) => peopleFromRecord(record, checklist, user?.name ?? "")}
      parentShortcuts={[{ label: "View my profile", icon: "user", onPress: openProfile }]}
      babyShortcutsOf={(checklist) =>
        !onBabyLedger && checklist ? [{ label: "Open baby's record", icon: "check-square", onPress: () => openBaby(checklist.baby._id) }] : []
      }
      emptyAction={isLedgerVisit(record) ? { label: "View my records", icon: "file-text", onPress: openRecords } : undefined}
      checklistFooter={(checklist, reload) => (
        <>
          {checklist.schedulingReviewRequired ? (
            <Text style={styles.notice}>An in-progress visit needs midwife review before another appointment can be assigned.</Text>
          ) : null}
          <Block title="Reminders" palette={palette}>
            <ReminderPreference enabled={checklist.remindersEnabled} onReload={reload} />
          </Block>
        </>
      )}
      trailing={
        <>
          {onBabyLedger ? null : <VisitFacts record={record} serviceLabel={serviceLabel} />}
          <ClinicalFacts record={withoutGeneratedProgress(record)} />
          <ItemsGivenFacts record={record} />
          <FollowUpFacts followUp={followUp} />
        </>
      }
    />
  );
};

export default ResidentImmunizationRecord;
