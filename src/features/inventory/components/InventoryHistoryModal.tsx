import { Modal, Pressable, ScrollView, View } from "react-native";

import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";

import type { InventoryItem } from "@/features/inventory/services/inventoryService";

import { createShadow } from "@/design/shadow";

import { RADIUS, useInventoryPalette } from "./inventoryTheme";
import HistoryEntry from "./history/HistoryEntry";
import HistoryModalHeader from "./history/HistoryModalHeader";
import {
  HistoryEmpty,
  HistoryError,
  HistoryLoadMore,
  HistoryLoading,
} from "./history/HistoryStates";
import { useItemHistory } from "./history/useItemHistory";

type InventoryHistoryModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  onClose: () => void;
};

const InventoryHistoryModal = ({
  visible,
  item,
  onClose,
}: InventoryHistoryModalProps) => {
  const palette = useInventoryPalette();
  // Centred on every width, phones included, so it keeps clear of the status bar.
  const layout = useSheetLayout({
    enabled: visible,
    variant: "centered",
    maxHeightRatio: 0.88,
    edgePadding: 16,
  });
  const history = useItemHistory(visible, item);

  if (!item) return null;

  const { entries, loading, loadingMore, error, hasMore, page, total, load } = history;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={backDismissesKeyboardFirst(layout, onClose)}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{ backgroundColor: "rgba(15,37,87,0.35)", paddingHorizontal: 16 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close inventory history"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden border"
          style={{
            maxWidth: 560,
            maxHeight: layout.maxHeight,
            borderRadius: RADIUS.card,
            backgroundColor: palette.cardBg,
            borderColor: palette.cardBorder,
            ...createShadow({
              color: "#0F172A",
              opacity: 0.18,
              radius: 28,
              offsetY: 2,
              elevation: 12,
            }),
          }}
        >
          <HistoryModalHeader itemName={item.name} total={total} onClose={onClose} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {loading ? (
              <HistoryLoading />
            ) : error ? (
              <HistoryError message={error} onRetry={() => load(1)} />
            ) : entries.length === 0 ? (
              <HistoryEmpty />
            ) : (
              <>
                {entries.map((entry, index) => (
                  <HistoryEntry
                    key={entry._id}
                    entry={entry}
                    unit={item.unit}
                    isLast={index === entries.length - 1 && !hasMore}
                  />
                ))}

                {hasMore ? (
                  <HistoryLoadMore loadingMore={loadingMore} onPress={() => load(page + 1)} />
                ) : (
                  <View className="h-4" />
                )}
              </>
            )}
          </ScrollView>
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default InventoryHistoryModal;
