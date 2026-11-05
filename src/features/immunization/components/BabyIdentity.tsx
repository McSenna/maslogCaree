import { Text, View } from "react-native";
import { formatCalendarDay } from "@/features/medicalRecordMasterlist/masterlistLabels";
import type { Checklist } from "../types";
import BabyRenameField from "./BabyRenameField";
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
  const { baby, mother } = checklist;
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.heading}>
        {baby.name}
      </Text>
      <Text style={styles.body}>
        Mother: {mother.name}
        {"\n"}Mother ID: {mother.masterResidentId}
        {"\n"}Baby ID: {baby._id}
        {"\n"}Date of birth: {formatCalendarDay(baby.dateOfBirth)}
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
        {checklist.nextScheduledDate ? formatCalendarDay(checklist.nextScheduledDate) : "Not reserved"}
      </Text>
      {!checklist.nextScheduledDate && checklist.nextProposedDate ? (
        <Text style={styles.body}>Proposed Thursday (not reserved): {formatCalendarDay(checklist.nextProposedDate)}</Text>
      ) : null}
      <Text style={styles.body}>
        The system assigns the first available Thursday on or after the routine target or documented follow-up date.
        Account appointments require verified linkage and an active schedule. Birth doses and missed visits remain for midwife review.
      </Text>
      {checklist.schedulingReviewRequired ? (
        <Text style={styles.notice}>An in-progress visit needs midwife review before another appointment can be assigned.</Text>
      ) : null}
      {isMidwife && baby.temporaryName ? <BabyRenameField checklist={checklist} onReload={onReload} disabled={disabled} /> : null}
    </View>
  );
};
export default BabyIdentity;
