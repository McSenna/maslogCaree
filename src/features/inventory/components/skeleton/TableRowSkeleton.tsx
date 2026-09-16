import { View } from "react-native";
import { INVENTORY_COLUMNS } from "../inventoryFilters";
import { useInventoryPalette } from "../inventoryTheme";
import Bar from "./Bar";

const TableRowSkeleton = ({ isLast }: { isLast: boolean }) => {
  const palette = useInventoryPalette();

  return (
    <View
      className="w-full flex-row items-center"
      style={{ minHeight: 68, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: palette.divider }}
    >
      <View className="items-center px-2.5" style={{ width: INVENTORY_COLUMNS.checkbox }}>
        <Bar width={18} height={18} />
      </View>
      <View className="flex-row items-center gap-2.5 px-2.5" style={{ flex: INVENTORY_COLUMNS.item, minWidth: 0 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: palette.skeleton }} />
        <View className="min-w-0 flex-1 gap-1.5">
          <Bar width="70%" height={12} />
          <Bar width="45%" height={9} />
        </View>
      </View>
      <View className="px-2.5" style={{ flex: INVENTORY_COLUMNS.category, minWidth: 0 }}>
        <Bar width={72} height={22} />
      </View>
      <View className="px-2.5" style={{ flex: INVENTORY_COLUMNS.batch, minWidth: 0 }}>
        <Bar width="80%" />
      </View>
      <View className="px-2.5" style={{ flex: INVENTORY_COLUMNS.stock, minWidth: 0 }}>
        <Bar width="60%" />
      </View>
      <View className="px-2.5" style={{ flex: INVENTORY_COLUMNS.unit, minWidth: 0 }}>
        <Bar width="55%" />
      </View>
      <View className="px-2.5" style={{ flex: INVENTORY_COLUMNS.reorderLevel, minWidth: 0 }}>
        <Bar width="50%" />
      </View>
      <View className="px-2.5" style={{ flex: INVENTORY_COLUMNS.expiry, minWidth: 0 }}>
        <Bar width="75%" />
      </View>
      <View className="px-2.5" style={{ flex: INVENTORY_COLUMNS.status, minWidth: 0 }}>
        <Bar width={78} height={22} />
      </View>
    </View>
  );
};

export default TableRowSkeleton;
