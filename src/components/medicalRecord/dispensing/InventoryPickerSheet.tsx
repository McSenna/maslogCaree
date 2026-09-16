import { ActivityIndicator, FlatList, Modal, Pressable, Text, View, useWindowDimensions } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { InventoryCategory, InventoryItem } from "@/features/inventory/services/inventoryService";

import InventoryPickerRow from "./InventoryPickerRow";
import {
  PickerEmptyState,
  PickerHeader,
  PickerSearchBar,
} from "./picker/PickerChrome";
import { useInventorySearch } from "./picker/useInventorySearch";

const SHEET_WIDTH = 768;

const InventoryPickerSheet = ({
  visible,
  selectedIds,
  onPick,
  onClose,
  category,
  title = "Add medicine or supply",
  searchPlaceholder = "Search medicines or supplies...",
}: {
  visible: boolean;
  selectedIds: Set<string>;
  onPick: (item: InventoryItem) => void;
  onClose: () => void;
  category?: InventoryCategory;
  title?: string;
  searchPlaceholder?: string;
}) => {
  const palette = useQueuePalette();
  const { width } = useWindowDimensions();
  const isSheet = width < SHEET_WIDTH;

  const picker = useInventorySearch(visible, category);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close the inventory picker"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : 560,
            height: isSheet ? "78%" : "76%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isSheet ? 0 : 24,
            borderBottomRightRadius: isSheet ? 0 : 24,
            backgroundColor: palette.panelBg,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-2.5">
              <View
                style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }}
              />
            </View>
          ) : null}

          <PickerHeader title={title} onClose={onClose} />

          <PickerSearchBar
            search={picker.search}
            onChangeText={picker.setSearch}
            placeholder={searchPlaceholder}
            loading={picker.loading}
          />

          {picker.error ? (
            <View className="px-4 py-3">
              <Text className="text-[12.5px] font-medium" style={{ color: "#DC2626" }}>
                {picker.error}
              </Text>
            </View>
          ) : null}

          <FlatList
            data={picker.items}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24, gap: 2 }}
            renderItem={({ item }) => (
              <InventoryPickerRow
                item={item}
                selected={selectedIds.has(item._id)}
                onPick={onPick}
              />
            )}
            ListEmptyComponent={picker.loading ? null : <PickerEmptyState category={category} />}
            onEndReachedThreshold={0.4}
            onEndReached={() =>
              picker.canLoadMore && void picker.load(picker.page + 1, picker.debounced)
            }
            ListFooterComponent={
              picker.loadingMore ? (
                <View className="items-center py-4">
                  <ActivityIndicator size="small" color={palette.primary} />
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default InventoryPickerSheet;
