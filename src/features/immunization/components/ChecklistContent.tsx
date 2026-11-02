import { useState, useSyncExternalStore } from "react";
import { View } from "react-native";
import type { Checklist, DoseView } from "../types";
import { useClinicalTransition } from "../hooks/useClinicalDraft";
import {
  getImmunizationVisit,
  subscribeImmunizationVisit,
} from "../visitSelection";
import CompleteLinkedVisit from "./CompleteLinkedVisit";
import BabyIdentity from "./BabyIdentity";
import RecordProgress from "./RecordProgress";
import ScheduleContext from "./ScheduleContext";
import ChecklistGrid from "./ChecklistGrid";
import DoseForm from "./DoseForm";
import DoseDetails from "./DoseDetails";
import ReminderPreference from "./ReminderPreference";
import useImmunizationStyles from "./immunizationStyles";

const ChecklistContent = ({
  checklist,
  isMidwife,
  onReload,
  embedded = false,
  busy = false,
  onContentChange,
}: {
  checklist: Checklist;
  isMidwife: boolean;
  onReload: () => Promise<void>;
  embedded?: boolean;
  busy?: boolean;
  onContentChange?: () => void;
}) => {
  const { styles } = useImmunizationStyles();
  const transition = useClinicalTransition();
  const [selectedDose, setSelectedDose] = useState<DoseView | null>(null);
  const [viewing, setViewing] = useState(false);
  const appointmentId = useSyncExternalStore(
    subscribeImmunizationVisit,
    getImmunizationVisit,
    () => null,
  );
  const closeDose = () => {
    setSelectedDose(null);
    setViewing(false);
    onContentChange?.();
  };
  if (selectedDose && viewing)
    return (
      <DoseDetails
        checklist={checklist}
        dose={selectedDose}
        canEdit={
          isMidwife &&
          !busy &&
          checklist.doses.some((dose) => dose.key === selectedDose.key)
        }
        embedded={embedded}
        onClose={closeDose}
        onEdit={() => {
          setViewing(false);
          onContentChange?.();
        }}
      />
    );
  if (embedded && selectedDose && isMidwife)
    return (
      <DoseForm
        key={`${checklist.baby._id}-${selectedDose.key}`}
        checklist={checklist}
        dose={selectedDose}
        onSaved={onReload}
        onClose={closeDose}
        onRequestClose={() => transition(closeDose)}
        embedded
        onContentChange={onContentChange}
      />
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
      {selectedDose && isMidwife ? (
        <DoseForm
          key={`${checklist.baby._id}-${selectedDose.key}-${selectedDose.record?.revision ?? 0}`}
          checklist={checklist}
          dose={selectedDose}
          onSaved={onReload}
          onClose={() => setSelectedDose(null)}
        />
      ) : null}
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
        onSelect={(dose) =>
          transition(() => {
            setSelectedDose(dose);
            setViewing(!!dose.record);
            onContentChange?.();
          })
        }
      />
      {!isMidwife ? (
        <ReminderPreference
          enabled={checklist.remindersEnabled}
          onReload={onReload}
        />
      ) : null}
    </View>
  );
};
export default ChecklistContent;
