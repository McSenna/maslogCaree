import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import QuantityStepper from "./QuantityStepper";
import type { DispensedLine } from "./useDispensedItems";

const DispensedItemRow = ({
  line,
  onChangeQuantity,
  onRemove,
  disabled = false,
}: {
  line: DispensedLine;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
  disabled?: boolean;
}) => {
  const palette = useQueuePalette();
  const { item, quantity } = line;

  const exceeds = item.currentStock > 0 && quantity > item.currentStock;
  const subtitle = [item.category, item.specification].filter(Boolean).join(" · ");

  return (
    <View
      className="w-full gap-3 p-3"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        borderWidth: 1,
        borderColor: exceeds ? "#FCA5A5" : palette.panelBorder,
        backgroundColor: palette.panelBg,
      }}
    >
      <View className="flex-row items-start gap-2.5">
        <View className="min-w-0 flex-1 gap-0.5">
          <Text numberOfLines={2} className="text-[14px] font-semibold" style={{ color: palette.heading }}>
            {item.name}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} className="text-[12px] capitalize" style={{ color: palette.muted }}>
              {subtitle}
            </Text>
          ) : null}
          <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
            Available: {item.currentStock} {item.unit}
          </Text>
        </View>

        <Pressable
          onPress={onRemove}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name}`}
          hitSlop={10}
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: palette.skeleton, opacity: disabled ? 0.5 : 1 }}
        >
          <Feather name="trash-2" size={15} color={palette.muted} />
        </Pressable>
      </View>

      <QuantityStepper
        value={quantity}
        onChange={onChangeQuantity}
        available={item.currentStock}
        unit={item.unit}
        disabled={disabled}
        itemName={item.name}
      />

      {exceeds ? (
        <Text className="text-[12px] font-medium" style={{ color: "#DC2626" }}>
          Only {item.currentStock} {item.unit} available.
        </Text>
      ) : null}
    </View>
  );
};

export default DispensedItemRow;
