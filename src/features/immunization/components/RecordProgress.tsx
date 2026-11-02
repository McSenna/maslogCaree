import { Text, View } from "react-native";
import type { Checklist } from "../types";
import { immunizationProgressLabel } from "@/services/immunizationRecordProgress";
import useImmunizationStyles from "./immunizationStyles";

const RecordProgress = ({ record }: { record: Checklist["medicalRecord"] }) => {
  const { styles } = useImmunizationStyles();
  return (
    <View style={styles.section} accessibilityLiveRegion="polite">
      <Text style={styles.strong}>
        Medical record:{" "}
        {record ? immunizationProgressLabel(record) : "Not started"}
      </Text>
      <Text style={styles.body}>
        {record?.recordStatus === "completed"
          ? "All doses in this routine checklist are documented as administered. Your midwife reviews clinical validity; this is not the complete lifetime vaccination schedule."
          : record
            ? "Each saved dose updates this baby's medical record. It remains In progress until every dose in this routine checklist is recorded as administered."
            : "Saving an administration or documented follow-up starts this baby's medical record. Unchecked doses remain unfinished."}
      </Text>
    </View>
  );
};
export default RecordProgress;
