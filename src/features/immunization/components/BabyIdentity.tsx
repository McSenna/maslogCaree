import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import useClinicalSave from "../hooks/useClinicalSave";
import { useClinicalDraft } from "../hooks/useClinicalDraft";
import { immunizationApi } from "../services/immunizationApi";
import type { Checklist } from "../types";
import ClinicalField from "./ClinicalField";
import useImmunizationStyles from "./immunizationStyles";

const BabyIdentity = ({
  checklist,
  isMidwife,
  onReload,
  disabled = false,
}: {
  checklist: Checklist;
  isMidwife: boolean;
  onReload: () => Promise<void>;
  disabled?: boolean;
}) => {
  const { styles } = useImmunizationStyles();
  const [name, setName] = useState("");
  const saving = useClinicalSave();
  useClinicalDraft(name);
  const { baby, mother } = checklist;
  const rename = () => {
    if (!name.trim()) {
      saving.setError("Enter the baby's registered name before saving.");
      return;
    }
    void saving.save(
      () =>
        immunizationApi.renameBaby({
          motherMasterResidentId: mother.masterResidentId,
          babyId: baby._id,
          name: name.trim(),
        }),
      onReload,
    );
  };
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.heading}>
        {baby.name}
      </Text>
      <Text style={styles.body}>
        Mother: {mother.name}
        {"\n"}Mother ID: {mother.masterResidentId}
        {"\n"}Baby ID: {baby._id}
        {"\n"}Date of birth: {baby.dateOfBirth.slice(0, 10)}
        {"\n"}Age: {baby.age.months} months and {baby.age.days} days (
        {baby.age.weeks} weeks)
      </Text>
      <Text style={styles.body}>
        Mother account:{" "}
        {checklist.accountLinked
          ? "Linked"
          : "Account not linked. Automatic account reminders unavailable."}
      </Text>
      <Text style={styles.strong}>
        Next assigned appointment:{" "}
        {checklist.nextScheduledDate?.slice(0, 10) || "Not reserved"}
      </Text>
      {!checklist.nextScheduledDate && checklist.nextProposedDate ? (
        <Text style={styles.body}>Proposed Thursday (not reserved): {checklist.nextProposedDate.slice(0,10)}</Text>
      ) : null}
      <Text style={styles.body}>
        The system assigns the first available Thursday on or after the routine target or documented follow-up date.
        Account appointments require verified linkage and an active schedule. Birth doses and missed visits remain for midwife review.
      </Text>
      {checklist.schedulingReviewRequired ? (
        <Text style={styles.notice}>An in-progress visit needs midwife review before another appointment can be assigned.</Text>
      ) : null}
      {isMidwife && baby.temporaryName ? (
        <View style={styles.section}>
          <ClinicalField
            label="Replace temporary newborn name"
            value={name}
            onChange={setName}
            disabled={saving.saving || disabled}
          />
          <Button
            label="Save baby name"
            variant="secondary"
            loading={saving.saving}
            disabled={disabled}
            onPress={rename}
          />
          {saving.error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {saving.error}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
export default BabyIdentity;
