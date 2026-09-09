import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  INCREASING_TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  fetchItemHistory,
  type InventoryItem,
  type InventoryTransactionEntry,
} from "@/services/inventoryService";
import { formatDateTime } from "@/utils/dateFormatter";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { CARD_SHADOW, RADIUS, useInventoryPalette } from "./inventoryTheme";

type InventoryHistoryModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  onClose: () => void;
};

function HistoryEntry({
  entry,
  unit,
  isLast,
}: {
  entry: InventoryTransactionEntry;
  unit: string;
  isLast: boolean;
}) {
  const palette = useInventoryPalette();
  const increasing = INCREASING_TRANSACTION_TYPES.includes(entry.type);
  const stamp = formatDateTime(entry.createdAt);

  const tone = increasing
    ? { text: palette.isDark ? "#86EFAC" : "#15803D", bg: palette.isDark ? "rgba(34,197,94,0.16)" : "#DCFCE7" }
    : { text: palette.isDark ? "#FDA4AF" : "#BE123C", bg: palette.isDark ? "rgba(244,63,94,0.16)" : "#FFE4E6" };

  return (
    <View
      className="w-full gap-2 py-3.5"
      style={{ borderBottomWidth: isLast ? 0 : 1, borderBottomColor: palette.divider }}
    >
      <View className="flex-row items-center gap-2">
        <View className="self-start px-2 py-1" style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}>
          <Text className="text-[11px] font-semibold" style={{ color: tone.text }}>
            {TRANSACTION_TYPE_LABELS[entry.type] ?? entry.type}
          </Text>
        </View>
        <Text className="text-[13px] font-bold" style={{ color: tone.text }}>
          {increasing ? "+" : "−"}
          {entry.quantity.toLocaleString()} {unit}
        </Text>
        <View className="flex-1" />
        <Text className="text-[11.5px]" numberOfLines={1} style={{ color: palette.subtle }}>
          {stamp.date} · {stamp.time}
        </Text>
      </View>

      {/* The before/after figures are what make the row auditable: a reader can
          follow the running balance without recomputing it from the deltas. */}
      <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
        <Text className="text-[12px]" style={{ color: palette.muted }}>
          Stock: <Text style={{ color: palette.body, fontWeight: "600" }}>
            {entry.previousStock.toLocaleString()} → {entry.newStock.toLocaleString()}
          </Text>
        </Text>
        {entry.batchNumber ? (
          <Text className="text-[12px]" style={{ color: palette.muted }}>
            Batch: <Text style={{ color: palette.body, fontWeight: "600" }}>{entry.batchNumber}</Text>
          </Text>
        ) : null}
      </View>

      <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
        <Text className="text-[12px]" style={{ color: palette.muted }}>
          By: <Text style={{ color: palette.body, fontWeight: "600" }}>{entry.performedByName}</Text>
          {entry.performedByRole ? ` (${entry.performedByRole})` : ""}
        </Text>
        {entry.recipient ? (
          <Text className="text-[12px]" style={{ color: palette.muted }}>
            To: <Text style={{ color: palette.body, fontWeight: "600" }}>{entry.recipient}</Text>
          </Text>
        ) : null}
        {entry.source ? (
          <Text className="text-[12px]" style={{ color: palette.muted }}>
            From: <Text style={{ color: palette.body, fontWeight: "600" }}>{entry.source}</Text>
          </Text>
        ) : null}
      </View>

      {entry.reason ? (
        <Text className="text-[12.5px]" style={{ color: palette.body }}>
          {entry.reason}
        </Text>
      ) : null}
      {entry.notes ? (
        <Text className="text-[12px] italic" style={{ color: palette.subtle }}>
          {entry.notes}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Inventory History — the item's stock ledger.
 *
 * Paged rather than loaded whole: a fast-moving item accumulates thousands of
 * movements and the dialog only ever shows a screenful at a time.
 */
export default function InventoryHistoryModal({ visible, item, onClose }: InventoryHistoryModalProps) {
  const palette = useInventoryPalette();
  const { height } = useWindowDimensions();

  const [entries, setEntries] = useState<InventoryTransactionEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (targetPage: number) => {
      if (!item) return;
      const first = targetPage === 1;
      if (first) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const result = await fetchItemHistory(item._id, targetPage);
        setEntries((prev) => (first ? result.history : [...prev, ...result.history]));
        setPage(result.page);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to load this item's history. Please try again."));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [item]
  );

  useEffect(() => {
    if (!visible || !item) return;
    setEntries([]);
    setPage(1);
    setTotalPages(1);
    void load(1);
  }, [visible, item, load]);

  if (!item) return null;

  const hasMore = page < totalPages;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 items-center justify-center p-4" style={{ backgroundColor: "rgba(15,37,87,0.35)" }}>
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
          <View
            className="flex-row items-center gap-3 px-5 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <View
              className="h-10 w-10 items-center justify-center"
              style={{ backgroundColor: palette.bannerBg, borderRadius: 12 }}
            >
              <Feather name="clock" size={19} color={palette.primary} />
            </View>
            <View className="min-w-0 flex-1">
              <Text accessibilityRole="header" className="text-[16px] font-bold" style={{ color: palette.heading }}>
                Inventory History
              </Text>
              <Text className="mt-0.5 text-[12.5px]" numberOfLines={1} style={{ color: palette.muted }}>
                {item.name}
                {total > 0 ? ` · ${total.toLocaleString()} movement${total === 1 ? "" : "s"}` : ""}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close inventory history"
              hitSlop={12}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.divider }}
            >
              <Feather name="x" size={15} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {loading ? (
              <View className="items-center gap-3 py-14">
                <ActivityIndicator size="small" color={palette.primary} />
                <Text className="text-[13px]" style={{ color: palette.muted }}>
                  Loading history…
                </Text>
              </View>
            ) : error ? (
              <View className="items-center gap-3 py-14">
                <View
                  className="h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#FEE2E2" }}
                >
                  <Feather name="alert-circle" size={20} color={palette.danger} />
                </View>
                <Text className="text-center text-[13px]" style={{ color: palette.muted }}>
                  {error}
                </Text>
                <Pressable
                  onPress={() => load(1)}
                  accessibilityRole="button"
                  accessibilityLabel="Retry loading history"
                  className="h-10 justify-center px-5"
                  style={{ borderRadius: RADIUS.control, backgroundColor: palette.primary }}
                >
                  <Text className="text-[13px] font-semibold text-white">Retry</Text>
                </Pressable>
              </View>
            ) : entries.length === 0 ? (
              <View className="items-center gap-3 py-14">
                <View
                  className="h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: palette.divider }}
                >
                  <Feather name="clock" size={20} color={palette.subtle} />
                </View>
                <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
                  No stock movements yet
                </Text>
                <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
                  Adding or releasing stock records an entry here.
                </Text>
              </View>
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
                  <Pressable
                    onPress={() => load(page + 1)}
                    disabled={loadingMore}
                    accessibilityRole="button"
                    accessibilityLabel="Load more history"
                    className="my-4 h-11 flex-row items-center justify-center gap-2 border active:opacity-85"
                    style={{
                      borderRadius: RADIUS.control,
                      backgroundColor: palette.cardBg,
                      borderColor: palette.cardBorder,
                      opacity: loadingMore ? 0.6 : 1,
                    }}
                  >
                    {loadingMore ? <ActivityIndicator size="small" color={palette.primary} /> : null}
                    <Text className="text-[13.5px] font-semibold" style={{ color: palette.body }}>
                      {loadingMore ? "Loading…" : "Load more"}
                    </Text>
                  </Pressable>
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
}
