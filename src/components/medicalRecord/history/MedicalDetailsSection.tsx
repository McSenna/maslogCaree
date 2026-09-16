import { View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { DetailRow, RecordSection } from "@/components/ui/DetailSection";
import VitalSignsSection from "./VitalSignsSection";
import type { DetailGroup } from "./recordPresenter";

const STACKED_ABOVE = 90;

const MedicalDetailsSection = ({
  groups,
  palette,
  vitalColumns,
}: {
  groups: DetailGroup[];
  palette: QueuePalette;
  vitalColumns: number;
}) => {
  if (!groups.length) return null;

  return (
    <>
      {groups.map((group) =>
        group.isVitals ? (
          <VitalSignsSection
            key={group.title}
            group={group}
            palette={palette}
            columns={vitalColumns}
          />
        ) : (
          <RecordSection key={group.title} title={group.title} palette={palette}>
            <View className="w-full">
              {group.entries.map((entry, index) => (
                <DetailRow
                  key={entry.key}
                  label={entry.label}
                  value={entry.value}
                  palette={palette}
                  stacked={entry.value.length > STACKED_ABOVE}
                  last={index === group.entries.length - 1}
                />
              ))}
            </View>
          </RecordSection>
        )
      )}
    </>
  );
};

export default MedicalDetailsSection;
