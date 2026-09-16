import { View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { MeasurementTile, RecordSection } from "@/components/ui/DetailSection";
import type { DetailEntry, DetailGroup } from "./recordPresenter";

const VitalSignsSection = ({
  group,
  palette,
  columns,
}: {
  group: DetailGroup;
  palette: QueuePalette;
  columns: number;
}) => {
  if (!group.entries.length) return null;

  const rows: DetailEntry[][] = [];
  for (let i = 0; i < group.entries.length; i += columns) {
    rows.push(group.entries.slice(i, i + columns));
  }

  return (
    <RecordSection title={group.title} palette={palette}>
      <View className="w-full">
        {rows.map((row, rowIndex) => (
          <View
            key={row.map((entry) => entry.key).join("-")}
            className="w-full flex-row"
            style={
              rowIndex === rows.length - 1
                ? undefined
                : { borderBottomWidth: 1, borderBottomColor: palette.divider }
            }
          >
            {row.map((entry, index) => (
              <View
                key={entry.key}
                className="min-w-0 flex-1"
                style={
                  index === row.length - 1
                    ? undefined
                    : { borderRightWidth: 1, borderRightColor: palette.divider }
                }
              >
                <MeasurementTile entry={entry} palette={palette} />
              </View>
            ))}

            {row.length < columns
              ? Array.from({ length: columns - row.length }).map((_, index) => (
                  <View key={`filler-${index}`} className="flex-1" />
                ))
              : null}
          </View>
        ))}
      </View>
    </RecordSection>
  );
};

export default VitalSignsSection;
