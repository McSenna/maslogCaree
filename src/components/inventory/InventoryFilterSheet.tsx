import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SelectOption } from "@/components/users/SelectMenu";
import type { InventorySortKey } from "@/services/inventoryService";
import {
  CATEGORY_FILTER_OPTIONS,
  EXPIRY_STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  STOCK_STATUS_FILTER_OPTIONS,
  type CategoryFilter,
  type ExpiryStatusFilter,
  type StockStatusFilter,
} from "./inventoryFilters";
import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "./inventoryTheme";

export type InventoryFilterState = {
  category: CategoryFilter;
  stockStatus: StockStatusFilter;
  expiryStatus: ExpiryStatusFilter;
  sort: InventorySortKey;
};

export const DEFAULT_FILTERS: InventoryFilterState = {
  category: "all",
  stockStatus: "all",
  expiryStatus: "all",
  sort: "updated_desc",
};

type InventoryFilterSheetProps = {
  visible: boolean;
  /** Which half opens — the bar has a Filters button and a Sort button. */
  mode: "filters" | "sort";
  value: InventoryFilterState;
  onApply: (next: InventoryFilterState) => void;
  onClose: () => void;
};

/** A row of pill choices — bigger touch targets than a dropdown, and all options visible. */
function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  const palette = useInventoryPalette();

  return (
    <View className="w-full gap-2">
      <Text className="text-[12px] font-bold uppercase" style={{ color: palette.subtle, letterSpacing: 0.5 }}>
        {label}
      </Text>
      <View className="w-full flex-row flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${label}: ${option.label}`}
              className="flex-row items-center justify-center border px-3.5 active:opacity-85"
              style={{
                // Comfortably above the 44px touch-target guidance.
                minHeight: 44,
                borderRadius: RADIUS.control,
                backgroundColor: active ? palette.bannerBg : palette.cardBg,
                borderColor: active ? palette.primary : palette.cardBorder,
              }}
            >
              <Text
                className="text-[13.5px] font-semibold"
                style={{ color: active ? palette.primary : palette.body }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Filters and sorting for the phone.
 *
 * Four dropdowns in a row is a desktop toolbar; on a phone the same choices go
 * into a sheet as tappable pills, where every option is visible at once and
 * nothing has to be truncated to fit.
 *
 * Edits are held locally and only committed on Apply, so a half-set filter
 * never fires a request — and Reset restores the defaults without closing.
 */
export default function InventoryFilterSheet({
  visible,
  mode,
  value,
  onApply,
  onClose,
}: InventoryFilterSheetProps) {
  const palette = useInventoryPalette();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const [draft, setDraft] = useState<InventoryFilterState>(value);

  // Re-seed from the live filters each time it opens, so a cancelled edit is
  // genuinely discarded.
  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const isSort = mode === "sort";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,37,87,0.35)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSort ? "Close sort options" : "Close filters"}
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
            <Text accessibilityRole="header" className="text-[16px] font-bold" style={{ color: palette.heading }}>
              {isSort ? "Sort Inventory" : "Filter Inventory"}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={isSort ? "Close sort options" : "Close filters"}
              hitSlop={13}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.divider }}
            >
              <Feather name="x" size={16} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 18 }}>
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

          <View
            className="w-full flex-row gap-2.5 px-4 pt-3"
            style={{
              borderTopWidth: 1,
              borderTopColor: palette.divider,
              paddingBottom: Math.max(insets.bottom, 12) + 4,
            }}
          >
            <Pressable
              onPress={() =>
                setDraft((prev) =>
                  // Reset clears what this sheet owns and leaves the other half alone.
                  isSort
                    ? { ...prev, sort: DEFAULT_FILTERS.sort }
                    : {
                        ...prev,
                        category: DEFAULT_FILTERS.category,
                        stockStatus: DEFAULT_FILTERS.stockStatus,
                        expiryStatus: DEFAULT_FILTERS.expiryStatus,
                      }
                )
              }
              accessibilityRole="button"
              accessibilityLabel={isSort ? "Reset sorting" : "Reset filters"}
              className="flex-1 items-center justify-center border active:opacity-85"
              style={{
                height: CONTROL_HEIGHT,
                borderRadius: RADIUS.control,
                backgroundColor: palette.cardBg,
                borderColor: palette.cardBorder,
              }}
            >
              <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
                Reset
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onApply(draft)}
              accessibilityRole="button"
              accessibilityLabel={isSort ? "Apply sorting" : "Apply filters"}
              className="flex-1 items-center justify-center active:opacity-85"
              style={{
                height: CONTROL_HEIGHT,
                borderRadius: RADIUS.control,
                backgroundColor: palette.primary,
              }}
            >
              <Text className="text-[14px] font-semibold text-white">
                {isSort ? "Apply Sorting" : "Apply Filters"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
