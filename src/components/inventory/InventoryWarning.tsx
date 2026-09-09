import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { InventoryItem } from "@/services/inventoryService";
import { formatDate } from "@/utils/dateFormatter";
import { RADIUS, useInventoryPalette } from "./inventoryTheme";

type Tone = "warning" | "danger";

type Notice = { tone: Tone; title: string; body: string };

/**
 * The alerts an item's own numbers make true.
 *
 * Expiry and stock are independent problems, so both can be raised at once —
 * an almost-empty shelf of almost-expired vaccine needs reordering *and* using
 * up, and collapsing that into one banner loses half the instruction.
 *
 * Every notice carries an icon and its own words, so the state is never
 * communicated by the container's colour alone.
 */
export function buildInventoryNotices(item: InventoryItem): Notice[] {
  const notices: Notice[] = [];
  const days = item.daysUntilExpiry;

  if (item.expiryStatus === "expired") {
    notices.push({
      tone: "danger",
      title: "This item has expired.",
      body: `Expired on ${formatDate(item.nearestExpiry)}. Expired stock cannot be released and must be disposed of.`,
    });
  } else if (
    (item.expiryStatus === "expiring-soon" || item.expiryStatus === "urgent") &&
    days !== null
  ) {
    notices.push({
      tone: "warning",
      title: `This item expires in ${days} day${days === 1 ? "" : "s"}.`,
      body: `Expiration: ${formatDate(item.nearestExpiry)}. Consider using or restocking accordingly.`,
    });
  }

  if (item.stockStatus === "out-of-stock") {
    notices.push({
      tone: "danger",
      title: "Out of Stock",
      body: `There is nothing left to release. Reorder level is ${item.reorderLevel.toLocaleString()} ${item.unit}.`,
    });
  } else if (item.stockStatus === "low-stock") {
    notices.push({
      tone: "warning",
      title: "Low Stock",
      body: `Current stock: ${item.currentStock.toLocaleString()} ${item.unit}. Reorder level: ${item.reorderLevel.toLocaleString()} ${item.unit}.`,
    });
  }

  return notices;
}

/**
 * Renders the notices for an item. Draws nothing when there are none, so the
 * caller does not have to guard it.
 */
export default function InventoryWarning({ item }: { item: InventoryItem }) {
  const palette = useInventoryPalette();
  const notices = buildInventoryNotices(item);

  if (!notices.length) return null;

  return (
    <View className="w-full gap-2">
      {notices.map((notice) => {
        const isDanger = notice.tone === "danger";
        const color = isDanger ? palette.danger : palette.warningText;

        return (
          <View
            key={notice.title}
            accessible
            accessibilityRole="alert"
            accessibilityLabel={`${notice.title} ${notice.body}`}
            className="w-full flex-row items-start gap-2.5 border p-3"
            style={{
              borderRadius: RADIUS.control,
              backgroundColor: isDanger ? (palette.isDark ? "rgba(220,38,38,0.14)" : "#FEF2F2") : palette.warningBg,
              borderColor: isDanger ? (palette.isDark ? "rgba(220,38,38,0.32)" : "#FECACA") : palette.warningBorder,
            }}
          >
            <Feather name="alert-triangle" size={15} color={color} style={{ marginTop: 1 }} />
            <View className="min-w-0 flex-1">
              <Text className="text-[12.5px] font-bold leading-[17px]" style={{ color }}>
                {notice.title}
              </Text>
              <Text className="mt-0.5 text-[12px] font-medium leading-[17px]" style={{ color }}>
                {notice.body}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
