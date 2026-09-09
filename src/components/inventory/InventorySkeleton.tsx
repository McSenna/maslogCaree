import { View } from "react-native";
import { INVENTORY_COLUMNS } from "./inventoryFilters";
import { CARD_SHADOW, RADIUS, useInventoryPalette } from "./inventoryTheme";

function Bar({ width, height = 10 }: { width: number | `${number}%`; height?: number }) {
  const palette = useInventoryPalette();
  return <View style={{ width, height, borderRadius: 6, backgroundColor: palette.skeleton }} />;
}

function TableRowSkeleton({ isLast }: { isLast: boolean }) {
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
}

function MobileCardSkeleton({ dense }: { dense: boolean }) {
  const palette = useInventoryPalette();

  return (
    <View
      className="w-full border p-3"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          style={{
            width: dense ? 40 : 44,
            height: dense ? 40 : 44,
            borderRadius: 12,
            backgroundColor: palette.skeleton,
          }}
        />
        <View className="min-w-0 flex-1 gap-2">
          <Bar width="60%" height={13} />
          <Bar width="40%" height={10} />
          <View className="flex-row gap-1.5">
            <Bar width={68} height={20} />
            <Bar width={74} height={20} />
          </View>
        </View>
      </View>
      <View className="mt-3 flex-row gap-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
        <View className="flex-1 gap-1.5">
          <Bar width="45%" height={9} />
          <Bar width="70%" height={11} />
        </View>
        <View className="flex-1 gap-1.5">
          <Bar width="55%" height={9} />
          <Bar width="50%" height={11} />
        </View>
      </View>
    </View>
  );
}

/** Panel placeholder, so the details column is never an empty box while loading. */
export function DetailsSkeleton() {
  const palette = useInventoryPalette();

  return (
    <View
      className="w-full border p-4"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <Bar width="55%" height={14} />
      <View className="mt-4 flex-row items-center gap-3">
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: palette.skeleton }} />
        <View className="min-w-0 flex-1 gap-2">
          <Bar width="70%" height={13} />
          <Bar width="45%" height={10} />
        </View>
      </View>
      <View className="mt-4 gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={index} className="flex-row items-center gap-3">
            <View style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: palette.skeleton }} />
            <Bar width="40%" height={10} />
            <View className="flex-1" />
            <Bar width={64} height={10} />
          </View>
        ))}
      </View>
      <View className="mt-5 flex-row gap-2.5">
        <Bar width="48%" height={44} />
        <Bar width="48%" height={44} />
      </View>
    </View>
  );
}

type InventorySkeletonProps = {
  count?: number;
  /** true = cards (phone), false = table rows (desktop). */
  isMobile?: boolean;
  dense?: boolean;
};

export default function InventorySkeleton({
  count = 8,
  isMobile = false,
  dense = false,
}: InventorySkeletonProps) {
  if (isMobile) {
    return (
      <View className="w-full gap-2.5">
        {Array.from({ length: count }).map((_, index) => (
          <MobileCardSkeleton key={index} dense={dense} />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full">
      {Array.from({ length: count }).map((_, index) => (
        <TableRowSkeleton key={index} isLast={index === count - 1} />
      ))}
    </View>
  );
}
