import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import { savedDoseStatus } from "../savedDosePresentation";
import { isAdministered } from "../immunizationLogic";
import type { Checklist, DoseView } from "../types";
import DoseAudit from "./DoseAudit";
import DoseTiming from "./DoseTiming";
import useImmunizationStyles from "./immunizationStyles";

export default function DoseDetails({
  checklist,
  dose,
  canEdit,
  embedded,
  onEdit,
  onClose,
}: {
  checklist: Checklist;
  dose: DoseView;
  canEdit: boolean;
  embedded: boolean;
  onEdit: () => void;
  onClose: () => void;
}) {
  const { styles, colors } = useImmunizationStyles();
  const record = dose.record;
  if (!record) return null;
  const vaccine = checklist.schedule.vaccines.find(
    (item) => item.key === dose.vaccineKey,
  );
  const completed = isAdministered(record);
  const fields = [
    ["Actual administration date", record.administeredOn?.slice(0, 10)],
    ["Administration time", record.administeredAt],
    ["Administering clinician", record.administeredBy],
    ["Facility", record.facility],
    ["Batch / lot number", record.lotNumber],
    ["Recorded route", record.route],
    ["Site", record.site],
    ["Remarks", record.remarks],
    ["Reason / deferral", record.reason],
    ["Historical documentation", record.historical ? "Yes" : "No"],
  ];
  const body = (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.title}>
        Vaccination details
      </Text>
      <Text style={styles.heading}>
        {vaccine?.name ?? dose.vaccineKey} · {dose.label}
      </Text>
      <Text
        style={[
          styles.strong,
          { color: completed ? colors.success.fg : colors.warning.fg },
        ]}
      >
        {savedDoseStatus(record)}
      </Text>
      <View style={styles.divider}>
        <Text style={styles.strong}>{checklist.baby.name}</Text>
        <Text style={styles.body}>Baby ID: {checklist.baby._id}</Text>
        <Text style={styles.body}>
          Born: {checklist.baby.dateOfBirth.slice(0, 10)}
        </Text>
        <Text style={styles.body}>
          Mother: {checklist.mother.name} · {checklist.mother.masterResidentId}
        </Text>
      </View>
      <View style={styles.detailFields}>
        {fields.map(([label, value]) => (
          <View key={label} style={styles.detailField}>
            <Text style={styles.muted}>{label}</Text>
            <Text selectable style={styles.body}>
              {value || (record.workflowStatus === "draft" ? "Not yet recorded (draft)" : "Not recorded")}
            </Text>
          </View>
        ))}
      </View>
      <DoseTiming dose={dose} />
      <DoseAudit record={record} />
      <View style={styles.row}>
        {canEdit ? (
          <Button
            label={completed ? "Edit saved record" : record.workflowStatus === "draft" ? "Edit draft" : "Update dose record"}
            icon="edit-2"
            onPress={onEdit}
          />
        ) : null}
        <Button
          label="Back to checklist"
          variant="secondary"
          icon="arrow-left"
          onPress={onClose}
        />
      </View>
      {canEdit && completed ? (
        <Text style={styles.muted}>
          Corrections and voids require a reason and retain the original audit
          history.
        </Text>
      ) : null}
    </View>
  );
  if (embedded) return body;
  return (
    <CompleteModalShell
      visible
      dismissible
      onRequestClose={onClose}
      title="Saved vaccination"
      closeLabel="Close vaccination details"
    >
      {body}
    </CompleteModalShell>
  );
}
