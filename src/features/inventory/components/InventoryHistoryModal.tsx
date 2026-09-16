import { Modal, Pressable, ScrollView, View, useWindowDimensions } from "react-native";

import type { InventoryItem } from "@/features/inventory/services/inventoryService";

import { CARD_SHADOW, RADIUS, useInventoryPalette } from "./inventoryTheme";
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
  const { height } = useWindowDimensions();
  const history = useItemHistory(visible, item);

  if (!item) return null;

  const { entries, loading, loadingMore, error, hasMore, page, total, load } = history;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 items-center justify-center p-4"
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
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
            maxHeight: height * 0.88,
            borderRadius: RADIUS.card,
            backgroundColor: palette.cardBg,
            borderColor: palette.cardBorder,
            ...CARD_SHADOW,
            shadowOpacity: 0.18,
            shadowRadius: 28,
            elevation: 12,
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
      </View>
    </Modal>
  );
};

export default InventoryHistoryModal;
