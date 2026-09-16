import { Text, View } from "react-native";

import {
  INCREASING_TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  type InventoryTransactionEntry,
} from "@/features/inventory/services/inventoryService";
import { formatDateTime } from "@/utils/dateFormatter";

import { RADIUS, useInventoryPalette } from "../inventoryTheme";

const HistoryEntry = ({
  entry,
  unit,
  isLast,
}: {
  entry: InventoryTransactionEntry;
  unit: string;
  isLast: boolean;
}) => {
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
};

export default HistoryEntry;
