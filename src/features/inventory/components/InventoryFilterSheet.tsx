import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
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
  const { height } = useWindowDimensions();

  const [draft, setDraft] = useState<InventoryFilterState>(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const isSort = mode === "sort";
  const closeLabel = isSort ? "Close sort options" : "Close filters";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,37,87,0.35)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxHeight: height * 0.85,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: palette.cardBg,
            shadowColor: "#0F2557",
            shadowOpacity: 0.2,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -6 },
            elevation: 16,
          }}
        >
          <View className="items-center pb-1 pt-2.5">
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: palette.divider }} />
          </View>

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
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={closeLabel}
              hitSlop={13}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.divider }}
            >
              <Feather name="x" size={16} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView
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
        </View>
      </View>
    </Modal>
  );
};

export default InventoryFilterSheet;
