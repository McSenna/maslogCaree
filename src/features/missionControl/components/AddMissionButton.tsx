import { Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";

type AddMissionButtonProps = {
  palette: QueuePalette;
  onPress: () => void;
};

const AddMissionButton = ({ palette, onPress }: AddMissionButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add mission"
      className="h-10 flex-row items-center gap-2 px-4"
      style={{ borderRadius: 12, backgroundColor: palette.primary }}
    >
      <Feather name="plus" size={16} color="#FFFFFF" />
      <Text className="text-[13.5px] font-semibold text-white">Add Mission</Text>
    </Pressable>
  );
};

export default AddMissionButton;
