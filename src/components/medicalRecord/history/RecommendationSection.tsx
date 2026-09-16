import { View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalRecord } from "@/services/medicalRecords";
import { ProseBlock, RecordSection } from "@/components/ui/DetailSection";

const RecommendationSection = ({
  record,
  palette,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
}) => {
  const text = (record.recommendations ?? "").trim();
  if (!text) return null;

  const paragraphs = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <RecordSection title="Recommendations" palette={palette}>
      <View className="w-full">
        {paragraphs.map((paragraph, index) => (
          <ProseBlock
            key={`${index}-${paragraph.slice(0, 12)}`}
            text={paragraph}
            palette={palette}
            last={index === paragraphs.length - 1}
          />
        ))}
      </View>
    </RecordSection>
  );
};

export default RecommendationSection;
