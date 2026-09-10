import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import type { InventoryItem } from "../services/inventoryService";
import { PAGE_SIZE } from "../constants/inventoryLayout";
import { TABLE_MIN_WIDTH } from "./inventoryFilters";
import { CARD_SHADOW, RADIUS, useInventoryPalette } from "./inventoryTheme";
import InventorySkeleton from "./InventorySkeleton";
import InventoryTable from "./InventoryTable";

type InventoryTableCardProps = {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  /** Shown in place of the table when there is nothing to draw. */
  fallback: ReactNode;
  selectedId: string | null;
  onSelectItem: (item: InventoryItem) => void;
  checkedIds: ReadonlySet<string>;
  onToggleItem: (itemId: string, next: boolean) => void;
  onToggleAll: (next: boolean) => void;
  /** Measured width of the table area, so the columns can keep their proportions. */
  tableAreaWidth: number;
  onTableAreaWidth: (width: number) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

/** Desktop: the table and its pagination inside one white section. */
export default function InventoryTableCard({
  items,
  loading,
  error,
  fallback,
  selectedId,
  onSelectItem,
  checkedIds,
  onToggleItem,
  onToggleAll,
  tableAreaWidth,
  onTableAreaWidth,
  page,
  totalPages,
  total,
  onPageChange,
}: InventoryTableCardProps) {
  const palette = useInventoryPalette();

  return (
    <View
      className="w-full min-w-0 flex-1 overflow-hidden border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      {loading ? (
        <InventorySkeleton count={PAGE_SIZE} />
      ) : error || items.length === 0 ? (
        fallback
      ) : (
        // Below TABLE_MIN_WIDTH the ten columns cramp, so the table keeps its
        // proportions and scrolls sideways instead of squeezing.
        <View
          className="w-full"
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== tableAreaWidth) onTableAreaWidth(next);
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(tableAreaWidth, TABLE_MIN_WIDTH) }}>
              <InventoryTable
                items={items}
                selectedItemId={selectedId}
                onSelectItem={onSelectItem}
                checkedIds={checkedIds}
                onToggleItem={onToggleItem}
                onToggleAll={onToggleAll}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!loading && !error && total > 0 ? (
        <View className="w-full p-4" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            isDesktop
            onPageChange={onPageChange}
            noun="items"
          />
        </View>
      ) : null}
    </View>
  );
}
