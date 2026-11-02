import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import useClinicalSave from "../hooks/useClinicalSave";
import { useClinicalTransition } from "../hooks/useClinicalDraft";
import { immunizationApi } from "../services/immunizationApi";
import type { Checklist } from "../types";
import { setImmunizationVisit } from "../visitSelection";
import ClinicalToggle from "./ClinicalToggle";
import useImmunizationStyles from "./immunizationStyles";

const CompleteLinkedVisit = ({
  appointmentId,
  checklist,
  onReload,
  disabled = false,
}: {
  appointmentId: string;
  checklist: Checklist;
  onReload: () => Promise<void>;
  disabled?: boolean;
}) => {
  const { styles } = useImmunizationStyles();
  const [confirmed, setConfirmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const saving = useClinicalSave();
  const transition = useClinicalTransition();
  const save = () =>
    void saving.save(
      () =>
        immunizationApi.completeVisit({
          appointmentId,
          motherMasterResidentId: checklist.mother.masterResidentId,
          babyId: checklist.baby._id,
        }),
      async () => {
        setCompleted(true);
        setImmunizationVisit(null);
        await onReload();
      },
    );
  if (completed)
    return (
      <Text accessibilityRole="alert" style={styles.body}>
        The linked immunization visit was completed.
      </Text>
    );
  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>Complete linked immunization visit</Text>
      <Text style={styles.body}>
        Confirm that this is the baby seen for the appointment you opened. The
        selected mother must own that appointment. Record today&apos;s
        administration or follow-up before completing the visit.
      </Text>
      <Text style={styles.strong}>
        {checklist.baby.name}
        {"\n"}Baby ID: {checklist.baby._id}
        {"\n"}Mother: {checklist.mother.name}
        {"\n"}Mother ID: {checklist.mother.masterResidentId}
      </Text>
      <ClinicalToggle
        label="I confirm this baby matches the appointment"
        value={confirmed}
        onChange={setConfirmed}
        disabled={saving.saving || disabled}
      />
      <View style={styles.row}>
        <Button
          label="Complete linked visit"
          onPress={() => transition(save)}
          disabled={!confirmed || disabled}
          loading={saving.saving}
        />
        <Button
          label="Clear linked visit"
          variant="text"
          onPress={() => setImmunizationVisit(null)}
          disabled={saving.saving || disabled}
        />
      </View>
      {saving.error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {saving.error} Review the selected mother, baby, and today&apos;s dose
          entry before retrying.
        </Text>
      ) : null}
    </View>
  );
};
export default CompleteLinkedVisit;
