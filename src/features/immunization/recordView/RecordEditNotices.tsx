import { useSyncExternalStore } from "react";
import { Text, View } from "react-native";

import CompleteLinkedVisit from "../components/CompleteLinkedVisit";
import useImmunizationStyles from "../components/immunizationStyles";
import type { Checklist } from "../types";
import { getImmunizationVisit, subscribeImmunizationVisit } from "../visitSelection";

type Props = { checklist: Checklist; onReload: () => Promise<void>; busy: boolean };

/** What needs the midwife's attention while editing. Shows nothing when all is clear. */
const RecordEditNotices = ({ checklist, onReload, busy }: Props) => {
  const { styles } = useImmunizationStyles();
  const appointmentId = useSyncExternalStore(subscribeImmunizationVisit, getImmunizationVisit, () => null);
  if (!appointmentId && !checklist.schedulingReviewRequired && !checklist.legacyReviewRequired) return null;
  return (
    <View style={styles.section}>
      {appointmentId ? <CompleteLinkedVisit key={`${appointmentId}-${checklist.baby._id}`} appointmentId={appointmentId} checklist={checklist} onReload={onReload} disabled={busy} /> : null}
      {checklist.schedulingReviewRequired ? <Text style={styles.notice}>An in-progress visit needs midwife review before another appointment can be assigned.</Text> : null}
      {checklist.legacyReviewRequired ? <Text style={styles.notice}>Earlier medical records need review. They do not automatically check any dose. Open legacy records to compare them before recording a historical administration.</Text> : null}
    </View>
  );
};

export default RecordEditNotices;
