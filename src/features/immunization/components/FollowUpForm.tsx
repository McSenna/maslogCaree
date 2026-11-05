import { Text, View } from "react-native";
import { SectionCard } from "@/components/medicalRecord/complete/SectionCard";
import type useFollowUpEntry from "../hooks/useFollowUpEntry";
import ClinicalField from "./ClinicalField";
import ClinicalToggle from "./ClinicalToggle";
import useImmunizationStyles from "./immunizationStyles";

type Props = { entry: ReturnType<typeof useFollowUpEntry>; disabled: boolean };

const FollowUpForm = ({ entry, disabled }: Props) => {
  const { styles } = useImmunizationStyles();
  return (
    <SectionCard icon="calendar" title="Defer or request review">
      <Text style={styles.body}>
        This records a follow-up. The system assigns an available Thursday on or after this date. It does not mark this dose as administered.
      </Text>
      <View style={styles.section}>
        <ClinicalField label="Follow-up date" value={entry.followUpOn} onChange={entry.setFollowUpOn} date future required disabled={disabled} error={entry.errors.followUpOn} />
        <ClinicalField label="Follow-up reason" value={entry.reason} onChange={entry.setReason} required disabled={disabled} multiline error={entry.errors.reason} />
        <ClinicalToggle label="Deferred (turn off for requires review)" value={entry.deferred} onChange={entry.setDeferred} disabled={disabled} />
      </View>
    </SectionCard>
  );
};
export default FollowUpForm;
