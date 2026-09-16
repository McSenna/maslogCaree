import { Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";

type MissionToolsButtonProps = {
  palette: QueuePalette;
  onPress: () => void;
};

const MissionToolsButton = ({ palette, onPress }: MissionToolsButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open mission tools"
      className="h-10 flex-row items-center gap-2 px-3.5 active:opacity-85"
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: palette.panelBorder,
        backgroundColor: palette.panelBg,
      }}
    >
      <Feather name="sliders" size={15} color={palette.body} />
      <Text className="text-[13.5px] font-semibold" style={{ color: palette.body }}>
        Mission tools
      </Text>
    </Pressable>
  );
};

export default MissionToolsButton;
