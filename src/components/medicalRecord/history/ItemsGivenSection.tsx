import { View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalRecord } from "@/services/medicalRecords";
import { DetailRow, RecordSection } from "@/components/ui/DetailSection";

const ItemsGivenSection = ({
  record,
  palette,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
}) => {
  const items = record.itemsGiven ?? [];
  if (!items.length) return null;

  return (
    <RecordSection title="Medicines & Supplies Given" palette={palette}>
      <View className="w-full">
        {items.map((given, index) => (
          <DetailRow
            key={`${given.item}-${index}`}
            label={given.itemName}
            value={[
              `${given.quantity} ${given.unit}`,
              given.batchNumbers?.length ? `Batch ${given.batchNumbers.join(", ")}` : "",
            ]
              .filter(Boolean)
              .join(" · ")}
            palette={palette}
            last={index === items.length - 1}
          />
        ))}
      </View>
    </RecordSection>
  );
};

export default ItemsGivenSection;
