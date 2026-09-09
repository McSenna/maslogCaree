import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { CATEGORY_LABELS, resolveStatusBadges, type InventoryItem } from "@/services/inventoryService";
import CategoryBadge from "./CategoryBadge";
import StockStatusBadge from "./StockStatusBadge";
import { CARD_SHADOW, CATEGORY_ICONS, RADIUS, formatShortDate, useInventoryPalette } from "./inventoryTheme";

type InventoryMobileCardProps = {
  item: InventoryItem;
  /** Opens Item Details — the card's only interaction. */
  onPress: () => void;
  /** Narrowest phones (320–360px) trim the icon so the badges still fit. */
  dense?: boolean;
};

function SummaryLine({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  const palette = useInventoryPalette();

  return (
    <View className="flex-row items-center gap-1.5">
      <Text className="text-[12.5px]" style={{ color: palette.muted }}>
        {label}:
      </Text>
      <Text
        className="min-w-0 flex-1 text-[12.5px] font-semibold"
        numberOfLines={1}
        style={{ color: danger ? palette.danger : palette.heading }}
      >
        {value}
      </Text>
    </View>
  );
}

/**
 * One inventory item as a card — the phone's replacement for a table row.
 *
 * The whole card is the touch target and its only action: tapping it opens
 * Item Details, which is where every stock action lives on mobile. There is
 * deliberately no per-row menu — a three-dot control here would be a ~24px
 * target competing with the card itself, and would split the actions across
 * two places for no gain.
 *
 * Only what identifies an item and tells you whether it needs attention is
 * shown; the full record is one tap away.
 */
export default function InventoryMobileCard({
  item,
  onPress,
  dense = false,
}: InventoryMobileCardProps) {
  const palette = useInventoryPalette();
  const tone = palette.categories[item.category] ?? palette.categories.other;
  const badges = resolveStatusBadges(item);
  const expiryUrgent = item.expiryStatus === "expired" || item.expiryStatus === "urgent";

  const subtitle = [CATEGORY_LABELS[item.category], item.batchNumber].filter(Boolean).join(" • ");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}${item.specification ? `, ${item.specification}` : ""}. ${subtitle}. Stock ${item.currentStock} ${item.unit}. ${badges.map((b) => b.replace(/-/g, " ")).join(", ")}. Opens item details.`}
      // Press feedback rides on the class and the ripple: react-native-web drops
      // a function-form `style` on Pressable, taking the surface with it.
      className="w-full flex-row items-start gap-3 border p-3 active:opacity-90"
      android_ripple={{ color: `${palette.primary}12` }}
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View
        className="shrink-0 items-center justify-center"
        style={{
          width: dense ? 40 : 44,
          height: dense ? 40 : 44,
          backgroundColor: tone.bg,
          borderRadius: 12,
        }}
      >
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[item.category] ?? "package-variant-closed"}
          size={dense ? 20 : 22}
          color={tone.text}
        />
      </View>

      <View className="min-w-0 flex-1 gap-1.5">
        <View className="min-w-0">
          <Text
            className={dense ? "text-[15px] font-bold" : "text-[16px] font-bold"}
            numberOfLines={1}
            style={{ color: palette.heading }}
          >
            {item.name}
          </Text>
          <Text className="mt-0.5 text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
            {subtitle}
          </Text>
        </View>

        <SummaryLine label="Stock" value={`${item.currentStock.toLocaleString()} ${item.unit}`} />
        <SummaryLine
          label="Expiry"
          value={item.nearestExpiry ? formatShortDate(item.nearestExpiry) : "No expiry"}
          danger={expiryUrgent}
        />

        <View className="mt-0.5 flex-row flex-wrap items-center gap-1.5">
          <CategoryBadge category={item.category} size="sm" />
          {badges.map((status) => (
            <StockStatusBadge key={status} status={status} compact />
          ))}
        </View>
      </View>
    </Pressable>
  );
}
