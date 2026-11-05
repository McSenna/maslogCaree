import { Text, View } from "react-native";
import { SectionCard } from "@/components/medicalRecord/complete/SectionCard";
import { formatClock } from "@/components/medicalRecord/fields/clockFormat";
import { formatCalendarDay } from "@/features/medicalRecordMasterlist/masterlistLabels";
import type useDoseEntry from "../hooks/useDoseEntry";
import { doseIdentity } from "../immunizationLogic";
import type { DoseRecord } from "../types";
import useImmunizationStyles from "./immunizationStyles";

/** A last look before a correction or void changes a record already on file. */
type Props = { entry: ReturnType<typeof useDoseEntry>; saved: DoseRecord | null; signedInName: string };

const DoseReview = ({ entry, saved, signedInName }: Props) => {
  const { styles } = useImmunizationStyles();
  const { action, administration, reason } = entry;
  const blank = (value?: string) => value || "Not recorded";
  // Exactly what the server will store, not the old values held in the form.
  const identity = administration.historical
    ? { clinician: administration.administeredBy, location: administration.facility }
    : doseIdentity(saved, signedInName);
  return (
    <SectionCard icon="check-square" title="Review before saving">
      <View style={styles.section}>
        <Text style={styles.body}>
          {action === "void"
            ? "Void the saved administration for the baby and dose above. It will require review and retain its history."
            : `Save only this dose as administered on ${formatCalendarDay(administration.administeredOn)}.`}
        </Text>
        <Text style={styles.body}>Reason: {reason}</Text>
        {action !== "void" ? (
          <Text style={styles.body}>
            Time: {blank(formatClock(administration.administeredAt))}
            {"\n"}Clinician: {blank(identity.clinician)}
            {"\n"}Location: {blank(identity.location)}
            {administration.lotNumber ? `\nLot number: ${administration.lotNumber}` : ""}
            {administration.route ? `\nRoute: ${administration.route}` : ""}
            {administration.site ? `\nSite: ${administration.site}` : ""}
            {"\n"}Remarks: {blank(administration.remarks)}
            {"\n"}Immediate reaction: {blank(administration.immediateReaction)}
            {"\n"}Adverse event (AEFI): {blank(administration.aefi)}
            {"\n"}Historical: {administration.historical ? "Yes" : "No"}
          </Text>
        ) : null}
      </View>
    </SectionCard>
  );
};
export default DoseReview;
