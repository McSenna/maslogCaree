import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import useClinicalSave from "../hooks/useClinicalSave";
import { useClinicalDraft, useClinicalTransition } from "../hooks/useClinicalDraft";
import { newBirthRequestKey, validateBirth } from "../immunizationLogic";
import { immunizationApi } from "../services/immunizationApi";
import type { Mother } from "../types";
import ClinicalField from "./ClinicalField";
import useImmunizationStyles from "./immunizationStyles";

const BirthForm = ({
  mother,
  onSaved,
}: {
  mother: Mother;
  onSaved: (babyId: string) => void;
}) => {
  const { styles } = useImmunizationStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dateOfBirth, setBirth] = useState("");
  const [birthRecordId, setReference] = useState("");
  const [requestKey, setRequestKey] = useState(newBirthRequestKey);
  const saving = useClinicalSave();
  useClinicalDraft({ name, dateOfBirth, birthRecordId });
  const transition = useClinicalTransition();
  const save = () => {
    const issue = validateBirth(dateOfBirth);
    if (issue) {
      saving.setError(issue);
      return;
    }
    void saving.save(
      async () => {
        const result = await immunizationApi.createBaby({
          motherMasterResidentId: mother.masterResidentId,
          name: name.trim() || undefined,
          dateOfBirth,
          birthRecordId: birthRecordId.trim() || undefined,
          requestKey,
        });
        onSaved(result.baby._id);
      },
      () => {
        setOpen(false);
        setName("");
        setBirth("");
        setReference("");
        setRequestKey(newBirthRequestKey());
      },
    );
  };
  if (!open)
    return (
      <Button
        label="Record a birth"
        variant="secondary"
        icon="plus"
        onPress={() => setOpen(true)}
      />
    );
  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>Record a birth for {mother.name}</Text>
      <Text style={styles.body}>
        Record each baby separately, including twins. A blank name creates a
        temporary newborn name with a unique baby ID.
      </Text>
      <ClinicalField
        label="Baby name (optional)"
        value={name}
        onChange={setName}
        disabled={saving.saving}
      />
      <ClinicalField
        label="Date of birth"
        value={dateOfBirth}
        onChange={setBirth}
        date
        past
        required
        disabled={saving.saving}
      />
      <ClinicalField
        label="Birth record reference (optional)"
        value={birthRecordId}
        onChange={setReference}
        disabled={saving.saving}
      />
      {saving.error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {saving.error}
        </Text>
      ) : null}
      <View style={styles.row}>
        <Button label="Save birth" onPress={save} loading={saving.saving} />
        <Button
          label="Cancel birth entry"
          variant="text"
          disabled={saving.saving}
          onPress={() => transition(() => {
            setOpen(false);
            setName("");
            setBirth("");
            setReference("");
          })}
        />
      </View>
    </View>
  );
};
export default BirthForm;
