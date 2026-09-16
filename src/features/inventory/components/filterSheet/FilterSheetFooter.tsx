import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "../inventoryTheme";

type Props = {
  isSort: boolean;
  onReset: () => void;
  onApply: () => void;
};

const FilterSheetFooter = ({ isSort, onReset, onApply }: Props) => {
  const palette = useInventoryPalette();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="w-full flex-row gap-2.5 px-4 pt-3"
      style={{
        borderTopWidth: 1,
        borderTopColor: palette.divider,
        paddingBottom: Math.max(insets.bottom, 12) + 4,
      }}
    >
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel={isSort ? "Reset sorting" : "Reset filters"}
        className="flex-1 items-center justify-center border active:opacity-85"
        style={{
          height: CONTROL_HEIGHT,
          borderRadius: RADIUS.control,
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
        }}
      >
        <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
          Reset
        </Text>
      </Pressable>

      <Pressable
        onPress={onApply}
        accessibilityRole="button"
        accessibilityLabel={isSort ? "Apply sorting" : "Apply filters"}
        className="flex-1 items-center justify-center active:opacity-85"
        style={{
          height: CONTROL_HEIGHT,
          borderRadius: RADIUS.control,
          backgroundColor: palette.primary,
        }}
      >
        <Text className="text-[14px] font-semibold text-white">
          {isSort ? "Apply Sorting" : "Apply Filters"}
        </Text>
      </Pressable>
    </View>
  );
};

export default FilterSheetFooter;
