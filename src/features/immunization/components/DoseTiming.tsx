import { Text, View } from "react-native";
import type { DoseView } from "../types";
import useImmunizationStyles from "./immunizationStyles";

export default function DoseTiming({ dose }: { dose: DoseView }) {
  const { styles } = useImmunizationStyles();
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        Schedule and follow-up
      </Text>
      <Text style={styles.body}>
        Routine target: {dose.targetOn?.slice(0, 10) || "Not set"}
      </Text>
      <Text style={styles.body}>
        Assigned visit:{" "}
        {dose.appointmentId ? dose.scheduledOn?.slice(0, 10) : "Not reserved"}
      </Text>
      {dose.record?.followUpOn ? (
        <Text style={styles.body}>
          Clinician follow-up: {dose.record.followUpOn.slice(0, 10)}
        </Text>
      ) : null}
      {!dose.appointmentId && dose.proposedThursday ? (
        <Text style={styles.muted}>
          Proposed Thursday: {dose.proposedThursday.slice(0, 10)} (not reserved)
        </Text>
      ) : null}
      {dose.reviewRequired ? (
        <Text style={styles.notice}>
          Requires review by a midwife. A target date does not confirm clinical
          eligibility.
        </Text>
      ) : null}
    </View>
  );
}
