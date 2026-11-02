import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import type useDoseEntry from "../hooks/useDoseEntry";
import useImmunizationStyles from "./immunizationStyles";

const DoseReview = ({ entry }: { entry: ReturnType<typeof useDoseEntry> }) => {
  const { styles } = useImmunizationStyles();
  const { completed, action, administration, reason, saving } = entry;
  const label = completed
    ? action === "void"
      ? "Confirm void"
      : "Save correction"
    : "Complete Record";
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Review before saving</Text>
      <Text style={styles.body}>
        {completed && action === "void"
          ? "Void the saved administration for the baby and dose above. It will require review and retain its history."
          : `Save only this dose as administered on ${administration.administeredOn}.`}
      </Text>
      {completed ? <Text style={styles.body}>Reason: {reason}</Text> : null}
      {action !== "void" ? (
        <Text style={styles.body}>
          Time: {administration.administeredAt || "Not recorded"}
          {"\n"}Clinician: {administration.administeredBy || "Not recorded"}
          {"\n"}Facility: {administration.facility || "Not recorded"}
          {"\n"}Lot number: {administration.lotNumber || "Not recorded"}
          {"\n"}Route: {administration.route || "Not recorded"}
          {"\n"}Site: {administration.site || "Not recorded"}
          {"\n"}Remarks: {administration.remarks || "Not recorded"}
          {"\n"}Historical: {administration.historical ? "Yes" : "No"}
        </Text>
      ) : null}
      <View style={styles.row}>
        <Button label={label} loading={saving.saving} onPress={entry.save} />
        <Button
          label="Edit entry"
          variant="secondary"
          disabled={saving.saving}
          onPress={() => entry.setReviewing(false)}
        />
      </View>
    </View>
  );
};
export default DoseReview;
