import { View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalRecord } from "@/services/medicalRecords";
import { DetailRow, RecordSection } from "@/components/ui/DetailSection";
import { buildAssessmentEntries } from "./recordPresenter";

const AssessmentSection = ({
  record,
  palette,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
}) => {
  const entries = buildAssessmentEntries(record);
  if (!entries.length) return null;

  return (
    <RecordSection title="Medical Assessment" palette={palette}>
      <View className="w-full">
        {entries.map((entry, index) => (
          <DetailRow
            key={entry.key}
            label={entry.label}
            value={entry.value}
            palette={palette}
            stacked
            last={index === entries.length - 1}
          />
        ))}
      </View>
    </RecordSection>
  );
};

export default AssessmentSection;
