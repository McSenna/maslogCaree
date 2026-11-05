import { useState, useSyncExternalStore } from "react";
import { View } from "react-native";
import type { Checklist } from "../types";
import {
  getImmunizationVisit,
  subscribeImmunizationVisit,
} from "../visitSelection";
import CompleteLinkedVisit from "./CompleteLinkedVisit";
import BabyIdentity from "./BabyIdentity";
import RecordProgress from "./RecordProgress";
import ScheduleContext from "./ScheduleContext";
import ChecklistGrid from "./ChecklistGrid";
import VaccinationDoseModal from "./VaccinationDoseModal";
import ReminderPreference from "./ReminderPreference";
import useImmunizationStyles from "./immunizationStyles";

const ChecklistContent = ({
  checklist,
  isMidwife,
  onReload,
  busy = false,
}: {
  checklist: Checklist;
  isMidwife: boolean;
  onReload: () => Promise<void>;
  busy?: boolean;
}) => {
  const { styles } = useImmunizationStyles();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  // Looked up by key, so the modal always reads the latest loaded record for that dose.
  const selectedDose = selectedKey ? (checklist.doses.find((dose) => dose.key === selectedKey) ?? null) : null;
  const appointmentId = useSyncExternalStore(
    subscribeImmunizationVisit,
    getImmunizationVisit,
    () => null,
  );
  return (
    <View style={styles.section}>
      <BabyIdentity
        checklist={checklist}
        isMidwife={isMidwife}
        onReload={onReload}
        disabled={busy}
      />
      <RecordProgress record={checklist.medicalRecord} />
      <ScheduleContext checklist={checklist} />
      {isMidwife && appointmentId ? (
        <CompleteLinkedVisit
          key={`${appointmentId}-${checklist.baby._id}`}
          appointmentId={appointmentId}
          checklist={checklist}
          onReload={onReload}
          disabled={busy}
        />
      ) : null}
      <ChecklistGrid
        checklist={checklist}
        readOnly={!isMidwife}
        disabled={busy}
        onSelect={(dose) => setSelectedKey(dose.key)}
      />
      {!isMidwife ? (
        <ReminderPreference
          enabled={checklist.remindersEnabled}
          onReload={onReload}
        />
      ) : null}
      {selectedDose ? (
        <VaccinationDoseModal
          key={`${checklist.baby._id}-${selectedDose.key}`}
          checklist={checklist}
          dose={selectedDose}
          canEdit={isMidwife && !busy}
          onSaved={onReload}
          onClose={() => setSelectedKey(null)}
        />
      ) : null}
    </View>
  );
};
export default ChecklistContent;
