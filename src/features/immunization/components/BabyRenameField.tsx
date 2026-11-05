import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { useClinicalDraft } from "../hooks/useClinicalDraft";
import useClinicalSave from "../hooks/useClinicalSave";
import { immunizationApi } from "../services/immunizationApi";
import type { Checklist } from "../types";
import ClinicalField from "./ClinicalField";
import useImmunizationStyles from "./immunizationStyles";

type Props = { checklist: Checklist; onReload: () => Promise<void>; disabled?: boolean };

/** Replaces a newborn's temporary name with the registered one. */
const BabyRenameField = ({ checklist, onReload, disabled = false }: Props) => {
  const { styles } = useImmunizationStyles();
  const [name, setName] = useState("");
  const saving = useClinicalSave();
  useClinicalDraft(name);
  const rename = () => {
    if (!name.trim()) {
      saving.setError("Enter the baby's registered name before saving.");
      return;
    }
    void saving.save(
      () =>
        immunizationApi.renameBaby({
          motherMasterResidentId: checklist.mother.masterResidentId,
          babyId: checklist.baby._id,
          name: name.trim(),
        }),
      // A saved name is no longer an unsaved draft, so nothing should ask to discard it.
      async () => {
        setName("");
        await onReload();
      },
    );
  };
  return (
    <View style={styles.section}>
      <ClinicalField label="Replace temporary newborn name" value={name} onChange={setName} disabled={saving.saving || disabled} />
      <Button label="Save baby name" variant="secondary" loading={saving.saving} disabled={disabled} onPress={rename} />
      {saving.error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {saving.error}
        </Text>
      ) : null}
    </View>
  );
};
export default BabyRenameField;
