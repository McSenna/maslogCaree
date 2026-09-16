import { Pressable, Text, View } from "react-native";

import type { SelectOption } from "@/components/ui/SelectMenu";

import { RADIUS, useInventoryPalette } from "../inventoryTheme";

type Props<T extends string> = {
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (next: T) => void;
};

const ChoiceGroup = <T extends string,>({
  label,
  options,
  value,
  onChange,
}: Props<T>) => {
  const palette = useInventoryPalette();

  return (
    <View className="w-full gap-2">
      <Text
        className="text-[12px] font-bold uppercase"
        style={{ color: palette.subtle, letterSpacing: 0.5 }}
      >
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
};

export default ChoiceGroup;
