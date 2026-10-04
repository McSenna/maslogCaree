import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "../inventoryTheme";
import { PALETTE } from "@/theme/palette";

const AddItemButton = ({ onPress }: { onPress: () => void }) => {
  const palette = useInventoryPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add inventory item"
      className="flex-row items-center justify-center gap-2 px-5 active:opacity-85"
      style={{
        height: CONTROL_HEIGHT,
        borderRadius: RADIUS.control,
        backgroundColor: palette.primary,
      }}
    >
      <Feather name="plus" size={17} color={PALETTE.white} />
      <Text className="text-[14px] font-semibold text-white">Add Item</Text>
    </Pressable>
  );
};

export default AddItemButton;
