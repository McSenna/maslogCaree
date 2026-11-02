import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import MedicalFieldInput from "@/components/medicalRecord/MedicalFieldInput";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { MedicalField } from "@/services/medicalRecords";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import type { RecordDeletionState } from "../hooks/useRecordDeletion";
import { formatVisitDate } from "../masterlistLabels";
import { residentNameOf } from "./rowText";

const REASON_FIELD: MedicalField = {
  key: "deletionReason", label: "Reason for deletion", type: "textarea", required: true, maxLength: 500,
};

const RecordDeletionDialog = ({ deletion }: { deletion: RecordDeletionState }) => {
  const colors = useThemeColors();
  const record = deletion.target;
  if (!record) return null;
  return (
    <CompleteModalShell
      visible
      title="Delete medical record?"
      maxWidth={480}
      onRequestClose={deletion.close}
      dismissible={!deletion.saving}
      closeLabel="Cancel record deletion"
      footer={<View style={styles.actions}>
        <Button label="Cancel" variant="secondary" disabled={deletion.saving} onPress={deletion.close} />
        <Button label="Delete record" variant="danger" loading={deletion.saving} onPress={() => void deletion.remove()} />
      </View>}
    >
      <View style={styles.content}>
        <Text style={[TYPE.bodyStrong, {color:colors.heading}]}>{residentNameOf(record)}</Text>
        <Text style={[TYPE.body, {color:colors.body}]}>
          {record.serviceLabel} · {formatVisitDate(record.source, record.visitDate)}
        </Text>
        <Text style={[TYPE.body, {color:colors.body}]}>
          This record will be removed from the staff table and the patient’s Medical Records page. Its clinical history and audit trail will be retained. Appointment and vaccination status will stay unchanged.
        </Text>
        <MedicalFieldInput field={REASON_FIELD} value={deletion.reason} disabled={deletion.saving}
          onChange={value => deletion.setReason(typeof value === "string" ? value : "")} />
        {deletion.error ? <Text accessibilityRole="alert" style={[TYPE.body, {color:colors.danger.fg}]}>{deletion.error}</Text> : null}
      </View>
    </CompleteModalShell>
  );
};
const styles = StyleSheet.create({
  content: {gap:SPACING.md},
  actions: {flexDirection:"row",justifyContent:"flex-end",flexWrap:"wrap",gap:SPACING.sm},
});
export default RecordDeletionDialog;
