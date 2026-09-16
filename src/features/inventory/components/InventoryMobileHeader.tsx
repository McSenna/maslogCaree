import type { ReactNode } from "react";
import { Text, View } from "react-native";
import type { InventorySummary } from "../services/inventoryService";
import InventoryMetricCards from "./InventoryMetricCards";
import { useInventoryPalette } from "./inventoryTheme";

type InventoryMobileHeaderProps = {
  summary: InventorySummary;
  toolbar: ReactNode;
};

const InventoryMobileHeader = ({
  summary,
  toolbar,
}: InventoryMobileHeaderProps) => {
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
};

export default InventoryMobileHeader;
