import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";

import {
  CATEGORY_FILTER_OPTIONS,
  EXPIRY_STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  STOCK_STATUS_FILTER_OPTIONS,
} from "./inventoryFilters";
import { useInventoryPalette } from "./inventoryTheme";
import ChoiceGroup from "./filterSheet/ChoiceGroup";
import FilterSheetFooter from "./filterSheet/FilterSheetFooter";
import { resetDraft, type InventoryFilterState } from "./filterSheet/filterSheetState";

export { DEFAULT_FILTERS, type InventoryFilterState } from "./filterSheet/filterSheetState";

type InventoryFilterSheetProps = {
  visible: boolean;
  mode: "filters" | "sort";
  value: InventoryFilterState;
  onApply: (next: InventoryFilterState) => void;
  onClose: () => void;
};

const InventoryFilterSheet = ({
  visible,
  mode,
  value,
  onApply,
  onClose,
}: InventoryFilterSheetProps) => {
  const palette = useInventoryPalette();

  const [draft, setDraft] = useState<InventoryFilterState>(value);

  // Seed the draft on the closed -> open transition only. Keying off `value`
  // instead meant any re-render that produced a fresh filter object wiped the
  // selections the user was part way through making.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(value);
  }

  const isSort = mode === "sort";
  const closeLabel = isSort ? "Close sort options" : "Close filters";

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel={isSort ? "Sort Inventory" : "Filter Inventory"}
      surface={palette.cardBg}
      handleColor={palette.divider}
      maxHeightRatio={0.85}
      // FilterSheetFooter already pads itself past the home indicator.
      applyBottomInset={false}
      header={(requestClose) => (
        <View
          className="flex-row items-center justify-between px-4 pb-3 pt-1"
          style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
        >
          <Text
            accessibilityRole="header"
            className="text-[16px] font-bold"
            style={{ color: palette.heading }}
          >
            {isSort ? "Sort Inventory" : "Filter Inventory"}
          </Text>
          <Pressable
            onPress={requestClose}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
            hitSlop={13}
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.divider }}
          >
            <Feather name="x" size={16} color={palette.muted} />
          </Pressable>
        </View>
      )}
    >
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 18 }}
      >
        {isSort ? (
          <ChoiceGroup
            label="Sort by"
            options={SORT_OPTIONS}
            value={draft.sort}
            onChange={(sort) => setDraft((prev) => ({ ...prev, sort }))}
          />
        ) : (
          <>
            <ChoiceGroup
              label="Category"
              options={CATEGORY_FILTER_OPTIONS}
              value={draft.category}
              onChange={(category) => setDraft((prev) => ({ ...prev, category }))}
            />
            <ChoiceGroup
              label="Stock Status"
              options={STOCK_STATUS_FILTER_OPTIONS}
              value={draft.stockStatus}
              onChange={(stockStatus) => setDraft((prev) => ({ ...prev, stockStatus }))}
            />
            <ChoiceGroup
              label="Expiry"
              options={EXPIRY_STATUS_FILTER_OPTIONS}
              value={draft.expiryStatus}
              onChange={(expiryStatus) => setDraft((prev) => ({ ...prev, expiryStatus }))}
            />
          </>
        )}
      </ScrollView>

      <FilterSheetFooter
        isSort={isSort}
        onReset={() => setDraft((prev) => resetDraft(prev, isSort))}
        onApply={() => onApply(draft)}
      />
    </BottomSheet>
  );
};

export default InventoryFilterSheet;
