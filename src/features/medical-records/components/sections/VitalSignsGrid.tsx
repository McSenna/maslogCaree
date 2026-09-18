import { Text, View } from "react-native";

import type { DetailEntry } from "@/components/medicalRecord/history/recordDetailGroups";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

import DetailSection from "./DetailSection";

type Props = {
  palette: ResidentDialogPalette;
  entries: DetailEntry[];
};

export const VitalSignsGrid = ({ palette, entries }: Props) => {
  if (!entries.length) return null;

  return (
    <DetailSection palette={palette} title="Vital Signs" icon="activity" iconColor="#E11D48">
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {entries.map((vital) => (
          <View
            key={vital.key}
            accessible
            accessibilityLabel={`${vital.label}: ${vital.value}`}
            style={{
              flexGrow: 1,
              minWidth: 130,
              padding: 12,
              borderRadius: 10,
              backgroundColor: palette.cardRaised,
              borderColor: palette.border,
              borderWidth: 1,
            }}
          >
            <Text style={{ fontSize: 12, color: palette.muted, fontWeight: "500" }}>
              {vital.label}
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: palette.heading, marginTop: 4 }}
            >
              {vital.value}
            </Text>
          </View>
        ))}
      </View>
    </DetailSection>
  );
};

export default VitalSignsGrid;
