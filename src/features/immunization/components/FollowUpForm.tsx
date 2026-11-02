import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import type useClinicalSave from "../hooks/useClinicalSave";
import { useClinicalDraft } from "../hooks/useClinicalDraft";
import { isCalendarDay, todayKey } from "../immunizationLogic";
import { immunizationApi } from "../services/immunizationApi";
import type { PatientDose } from "../types";
import ClinicalField from "./ClinicalField";
import ClinicalToggle from "./ClinicalToggle";
import useImmunizationStyles from "./immunizationStyles";

const FollowUpForm = ({
  patient,
  onSaved,
  saving,
}: {
  patient: PatientDose;
  onSaved: () => Promise<void>;
  saving: ReturnType<typeof useClinicalSave>;
}) => {
  const { styles } = useImmunizationStyles();
  const [followUpOn, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [deferred, setDeferred] = useState(true);
  useClinicalDraft({ followUpOn, reason, deferred });
  const save = () => {
    if (!isCalendarDay(followUpOn) || followUpOn < todayKey()) {
      saving.setError("Select a follow-up date today or later.");
      return;
    }
    if (!reason.trim()) {
      saving.setError("Enter the reason for this follow-up.");
      return;
    }
    void saving.save(
      () =>
        immunizationApi.followUp({
          ...patient,
          followUpOn,
          reason: reason.trim(),
          deferred,
        }),
      onSaved,
    );
  };
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Defer or request review</Text>
      <Text style={styles.body}>
        This records a follow-up. The system assigns an available Thursday on or after this date. It does not mark this dose as administered.
      </Text>
      <ClinicalField
        label="Follow-up date"
        value={followUpOn}
        onChange={setDate}
        date
        future
        required
        disabled={saving.saving}
      />
      <ClinicalField
        label="Follow-up reason"
        value={reason}
        onChange={setReason}
        required
        disabled={saving.saving}
        multiline
      />
      <ClinicalToggle
        label="Deferred (turn off for requires review)"
        value={deferred}
        onChange={setDeferred}
        disabled={saving.saving}
      />
      {saving.error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {saving.error}
        </Text>
      ) : null}
      <Button
        label="Save follow-up"
        variant="secondary"
        loading={saving.saving}
        onPress={save}
      />
    </View>
  );
};
export default FollowUpForm;
