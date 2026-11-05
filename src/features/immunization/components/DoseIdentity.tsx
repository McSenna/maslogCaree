import { Text, View } from "react-native";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { Row } from "@/components/medicalRecord/details/RecordPrimitives";
import { formatCalendarDay } from "@/features/medicalRecordMasterlist/masterlistLabels";
import { savedDoseStatus } from "../savedDosePresentation";
import type { Checklist, DoseView } from "../types";
import useImmunizationStyles from "./immunizationStyles";

type Props = { checklist: Checklist; dose: DoseView };

const FactRows = ({ rows }: { rows: string[][] }) => {
  const palette = useQueuePalette();
  const { styles } = useImmunizationStyles();
  return (
    <View style={styles.detailFields}>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.detailField}>
          <Row label={label} value={value} palette={palette} />
        </View>
      ))}
    </View>
  );
};

/** Which vaccine and dose this is, and where it stands. */
export const DoseFacts = ({ checklist, dose }: Props) => {
  const vaccine = checklist.schedule.vaccines.find((item) => item.key === dose.vaccineKey);
  const age = checklist.schedule.slots.find((slot) => slot.key === dose.slot)?.label;
  return (
    <FactRows
      rows={[
        ["Vaccine", vaccine?.name ?? dose.vaccineKey],
        ["Dose", age ? `${dose.label} (${age})` : dose.label],
        ["Status", dose.record ? savedDoseStatus(dose.record) : dose.status],
      ]}
    />
  );
};

/** When this dose was planned. A target is not a clinical decision, and the notice says so. */
export const DoseSchedule = ({ dose }: { dose: DoseView }) => {
  const { styles } = useImmunizationStyles();
  return (
    <View style={styles.section}>
      <FactRows
        rows={[
          ["Routine target", dose.targetOn ? formatCalendarDay(dose.targetOn) : "Not set"],
          ["Assigned visit", dose.appointmentId ? formatCalendarDay(dose.scheduledOn) : "Not reserved"],
          ...(dose.record?.followUpOn ? [["Clinician follow-up", formatCalendarDay(dose.record.followUpOn)]] : []),
          ...(!dose.appointmentId && dose.proposedThursday ? [["Proposed Thursday", `${formatCalendarDay(dose.proposedThursday)} (not reserved)`]] : []),
        ]}
      />
      {dose.reviewRequired ? (
        <Text style={styles.notice}>Requires review by a midwife. A target date does not confirm clinical eligibility.</Text>
      ) : null}
    </View>
  );
};
