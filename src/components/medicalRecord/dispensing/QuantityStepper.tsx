import { Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  available: number;
  unit: string;
  disabled?: boolean;
  itemName: string;
};

const STEP_SIZE = 44;

const QuantityStepper = ({
  value,
  onChange,
  available,
  unit,
  disabled = false,
  itemName,
}: QuantityStepperProps) => {
  const palette = useQueuePalette();
  const blocked = disabled || available <= 0;

  const atMin = value <= 1;
  const atMax = available > 0 && value >= available;

  const step = (delta: number) => onChange(value + delta);

  const button = (direction: "minus" | "plus") => {
    const isMinus = direction === "minus";
    const isOff = blocked || (isMinus ? atMin : atMax);

    return (
      <Pressable
        onPress={() => step(isMinus ? -1 : 1)}
        disabled={isOff}
        accessibilityRole="button"
        accessibilityLabel={`${isMinus ? "Decrease" : "Increase"} quantity of ${itemName}`}
        accessibilityState={{ disabled: isOff }}
        className="items-center justify-center"
        style={{
          width: STEP_SIZE,
          height: STEP_SIZE,
          borderRadius: QUEUE_RADIUS.control,
          backgroundColor: palette.skeleton,
          opacity: isOff ? 0.45 : 1,
        }}
      >
        <Feather name={direction} size={16} color={palette.body} />
      </Pressable>
    );
  };

  return (
    <View className="flex-row items-center gap-2">
      {button("minus")}

      <TextInput
        value={String(value)}
        onChangeText={(text) => {
          const digits = text.replace(/[^0-9]/g, "");
          if (digits === "") return;
          onChange(Number(digits));
        }}
        editable={!blocked}
        keyboardType="number-pad"
        inputMode="numeric"
        accessibilityLabel={`Quantity of ${itemName} in ${unit}`}
        className="text-center text-[15px] font-bold"
        style={{
          minWidth: 56,
          height: STEP_SIZE,
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.panelBorder,
          backgroundColor: palette.panelBg,
          color: palette.heading,
          opacity: blocked ? 0.5 : 1,
          outlineStyle: "none",
        } as never}
      />

      {button("plus")}

      <Text
        numberOfLines={1}
        className="min-w-0 flex-1 text-[12px] font-medium"
        style={{ color: palette.muted }}
      >
        {unit}
      </Text>
    </View>
  );
};

export default QuantityStepper;
