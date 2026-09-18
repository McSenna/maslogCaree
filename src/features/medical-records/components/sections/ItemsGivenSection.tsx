import { Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { DispensedItem } from "@/services/medicalRecords";

import DetailSection from "./DetailSection";

const ITEM_TINT = "#6366F1";

export const ItemsGivenSection = ({
  palette,
  items,
}: {
  palette: ResidentDialogPalette;
  items: DispensedItem[];
}) => {
  if (!items.length) return null;

  return (
    <DetailSection
      palette={palette}
      title="Medicines / Items Given"
      icon="package"
      iconColor={ITEM_TINT}
    >
      <View style={{ gap: 8 }}>
        {items.map((item, index) => (
          <View
            key={`${item.item}-${index}`}
            accessible
            accessibilityLabel={`${item.itemName}, ${item.quantity} ${item.unit}`}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              padding: 10,
              borderRadius: 8,
              backgroundColor: palette.cardRaised,
              borderColor: palette.border,
              borderWidth: 1,
            }}
          >
            <View style={{ minWidth: 0, flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: palette.heading }}>
                {item.itemName}
              </Text>
              {item.specification ? (
                <Text style={{ fontSize: 11, color: palette.muted, marginTop: 2 }}>
                  {item.specification}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: palette.isDark
                  ? "rgba(99,102,241,0.18)"
                  : "rgba(99,102,241,0.10)",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: ITEM_TINT }}>
                {item.quantity} {item.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </DetailSection>
  );
};

export default ItemsGivenSection;
