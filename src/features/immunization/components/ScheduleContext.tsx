import { Text, View } from "react-native";
import type { Checklist } from "../types";
import useImmunizationStyles from "./immunizationStyles";

export default function ScheduleContext({
  checklist,
}: {
  checklist: Checklist;
}) {
  const { styles } = useImmunizationStyles();
  const { schedule } = checklist;
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.title}>
        {schedule.title}
      </Text>
      {checklist.legacyReviewRequired ? (
        <Text style={styles.notice}>
          Earlier medical records need review. They do not automatically check
          any dose. Open legacy records to compare them before recording a
          historical administration.
        </Text>
      ) : null}
    </View>
  );
}
