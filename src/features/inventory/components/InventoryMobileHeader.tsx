import type { ReactNode } from "react";
import { Text, View } from "react-native";
import type { InventorySummary } from "../services/inventoryService";
import InventoryMetricCards from "./InventoryMetricCards";
import { useInventoryPalette } from "./inventoryTheme";

type InventoryMobileHeaderProps = {
  summary: InventorySummary;
  toolbar: ReactNode;
};

/**
 * The phone list's heading, metrics and toolbar.
 *
 * The title is phone-only: the desktop shell already names the page in its
 * sidebar and chrome, so repeating it above the metric cards would spend a
 * band of vertical space saying what the surrounding frame has said. A phone
 * has no sidebar to carry that.
 */
export default function InventoryMobileHeader({
  summary,
  toolbar,
}: InventoryMobileHeaderProps) {
  const palette = useInventoryPalette();

  return (
    <View className="w-full gap-4 pb-3">
      <View className="w-full gap-1">
        <Text
          accessibilityRole="header"
          className="text-[26px] font-extrabold"
          style={{ color: palette.heading }}
        >
          Inventory Management
        </Text>
        <Text className="text-[14px] font-medium" style={{ color: palette.muted }}>
          Manage medicines, vaccines, supplies and equipment
        </Text>
      </View>

      <InventoryMetricCards summary={summary} isWide={false} />
      {toolbar}
    </View>
  );
}
